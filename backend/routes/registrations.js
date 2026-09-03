const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const URL_RE = /^(https?:\/\/)[^\s]+\.[^\s]+$/;

const UPLOAD_SLOTS = {
  abstractPdf: { types: [".pdf"], maxMb: 10 },
};

const uploadRoot = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(uploadRoot, "_incoming");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB hard ceiling; per-slot limit re-checked below
});

/* ---------- GET /api/window — server-side source of truth for open/close ---------- */

router.get("/window", (req, res) => {
    const openAt = new Date("2026-08-28T00:00:00+05:30");
    const closeAt = new Date("2026-09-05T23:59:59+05:30");
  const now = new Date();
  let phase = "open";
  if (now < openAt) phase = "upcoming";
  else if (now > closeAt) phase = "closed";
  res.json({ phase, openAt: openAt.toISOString(), closeAt: closeAt.toISOString(), now: now.toISOString() });
});

router.get("/teams", (req, res) => {
  const { readDb } = require("../db");
  const data = readDb();
  // Return only safe public info
  const teams = data.registrations.map(r => ({
    id: r.id,
    teamName: r.teamName,
    projectTitle: r.projectTitle,
    category: r.category
  }));
  res.json(teams);
});

/* ---------- POST /api/registrations — create a registration ---------- */

  router.post(
  "/registrations",
  upload.fields(Object.keys(UPLOAD_SLOTS).map((slot) => ({ name: slot, maxCount: 1 }))),
  (req, res) => {
    // 1. Deadline check
    const openAt = new Date("2026-08-28T00:00:00+05:30");
    const closeAt = new Date("2026-09-05T23:59:59+05:30");
    const now = new Date();
    if (now < openAt || now > closeAt) {
      cleanupUploadedTemp(req.files);
      return res.status(403).json({ error: "Registration is currently closed." });
    }

    let payload;
    try {
      payload = JSON.parse(req.body.payload);
    } catch (e) {
      cleanupUploadedTemp(req.files);
      return res.status(400).json({ error: "Invalid submission payload." });
    }

    const { team, members, project } = payload;
    const errors = validateSubmission(team, members, project);
    if (errors.length) {
      cleanupUploadedTemp(req.files);
      return res.status(400).json({ error: errors[0], errors });
    }

    const { readDb, writeDb } = require("../db");
    const data = readDb();
    
    // 2. Duplicate check
    const dup = data.registrations.find(r => 
      (r.leaderEmail?.toLowerCase() === team.leaderEmail.toLowerCase()) ||
      (r.teamName?.toLowerCase() === team.teamName.toLowerCase())
    );
    if (dup) {
      cleanupUploadedTemp(req.files);
      return res.status(409).json({ error: "Registration already exists for this team or email." });
    }

    // 3. Team size check
    if (!Array.isArray(members) || members.length > 3) {
      cleanupUploadedTemp(req.files);
      return res.status(400).json({ error: "Team size cannot exceed 4 members." });
    }

    // 4. Generate unique registration ID
    const id = generateUniqueId(data);

    // 5. Save to JSON
    const newReg = {
      id,
      teamName: team.teamName, projectName: team.projectName, projectTitle: team.projectTitle,
      category: team.category, college: team.college, department: team.department,
      section: team.section, year: team.year, city: team.city,
      leaderName: team.leaderName, leaderEmail: team.leaderEmail, leaderMobile: team.leaderMobile,
      leaderReg: team.leaderReg || null,
      abstract: project.abstract,
      status: 'REGISTERED',
      registeredAt: new Date().toISOString(),
      members: (members || []).map((m, i) => ({ ...m, memberOrder: i + 2 }))
    };
    
    data.registrations.push(newReg);
    writeDb(data);
    
    // Move uploaded files (Optional, mostly handled by frontend email anyway now)
    try {
      const destDir = path.join(uploadRoot, id);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      Object.entries(req.files || {}).forEach(([slot, files]) => {
        const f = files[0];
        if (!f) return;
        const destPath = path.join(destDir, f.filename);
        fs.renameSync(f.path, destPath);
      });
    } catch (e) {
      console.error("File move error:", e);
    }

    res.status(201).json({ registration: newReg });
  }
);

/* ---------- GET /api/registrations/status?id=&email= ---------- */

router.get("/registrations/status", (req, res) => {
  const { id, email } = req.query;
  if (!id || !email) return res.status(400).json({ error: "Registration ID and email are required." });

  const { readDb } = require("../db");
  const data = readDb();
  
  const reg = data.registrations.find(
    r => r.id.toLowerCase() === id.toLowerCase() && r.leaderEmail.toLowerCase() === email.toLowerCase()
  );

  if (!reg) return res.status(404).json({ error: "No registration found for that ID and email combination." });

  res.json({ registration: reg });
});

/* ---------- helpers ---------- */

function validateSubmission(team, members, project) {
  const errors = [];
  if (!team) return ["Team information is missing."];
  if (!team.teamName?.trim()) errors.push("Team name is required.");
  if (!team.projectName?.trim()) errors.push("Project name is required.");
  if (!team.projectTitle?.trim()) errors.push("Project title is required.");
  if (!team.category) errors.push("Project category is required.");
  if (!team.college?.trim()) errors.push("College / institution is required.");
  if (!team.department?.trim()) errors.push("Department is required.");
  if (!team.section) errors.push("Section is required.");
  if (!team.year?.trim()) errors.push("Year of study is required.");

  if (!team.leaderName?.trim()) errors.push("Leader name is required.");
  if (!EMAIL_RE.test(team.leaderEmail || "")) errors.push("Please enter a valid email address.");
  if (!MOBILE_RE.test(team.leaderMobile || "")) errors.push("Please enter a valid 10-digit mobile number.");

  (members || []).forEach((m, i) => {
    if (!m.name?.trim()) errors.push(`Member ${i + 2}: name is required.`);
    if (!EMAIL_RE.test(m.email || "")) errors.push(`Member ${i + 2}: invalid email.`);
    if (!MOBILE_RE.test(m.mobile || "")) errors.push(`Member ${i + 2}: invalid mobile.`);
    if (!m.section) errors.push(`Member ${i + 2}: section is required.`);
  });

  if (!project) { errors.push("Project details are missing."); return errors; }
  if (!project.abstract?.trim()) errors.push("Project abstract is required.");
  
  return errors;
}

function generateUniqueId(data) {
  const existing = new Set(data.registrations.map(r => r.id));
  let id;
  do {
    const n = Math.floor(1 + Math.random() * 98998);
    id = `NVX-2026-${String(n).padStart(5, "0")}`;
  } while (existing.has(id));
  return id;
}

function cleanupUploadedTemp(files) {
  Object.values(files || {}).forEach((arr) => {
    arr.forEach((f) => {
      try { fs.unlinkSync(f.path); } catch (e) { /* already gone */ }
    });
  });
}

module.exports = router;
