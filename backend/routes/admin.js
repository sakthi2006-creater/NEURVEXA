const express = require("express");
const { readDb, writeDb } = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(requireAdmin);

/* ---------- GET /api/admin/registrations — list all, with members ---------- */

router.get("/registrations", (req, res) => {
  const data = readDb();
  // Return registrations, sorting by date descending
  const sorted = [...data.registrations].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  
  // Convert camelCase JSON format to match what frontend expects (snake_case)
  const formatted = sorted.map(r => ({
    id: r.id,
    team_name: r.teamName,
    project_name: r.projectName,
    project_title: r.projectTitle,
    category: r.category,
    college: r.college,
    department: r.department,
    section: r.section,
    year_of_study: r.year,
    city: r.city,
    leader_name: r.leaderName,
    leader_email: r.leaderEmail,
    leader_mobile: r.leaderMobile,
    leader_reg_no: r.leaderReg,
    abstract: r.abstract,
    status: r.status,
    registered_at: r.registeredAt,
    members: r.members || [],
    files: []
  }));

  res.json({ registrations: formatted });
});

/* ---------- PATCH /api/admin/registrations/:id/status ---------- */

router.patch("/registrations/:id/status", (req, res) => {
  const { status } = req.body;
  const allowed = ["REGISTERED", "UNDER_REVIEW", "APPROVED", "REJECTED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(", ")}` });
  }
  
  const data = readDb();
  const index = data.registrations.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Registration not found." });
  
  data.registrations[index].status = status;
  writeDb(data);
  
  res.json({ ok: true });
});

/* ---------- GET /api/admin/export.csv ---------- */

router.get("/export.csv", (req, res) => {
  const data = readDb();
  const regs = [...data.registrations].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

  const header = [
    "Registration ID", "Team Name", "Leader Name", "Leader Email", "Leader Mobile",
    "Project Name", "Category", "Department", "Section", "Members Count", "Status", "Registered At",
  ];
  const rows = regs.map((r) => {
    const memberCount = 1 + (r.members ? r.members.length : 0);
    return [
      r.id, r.teamName, r.leaderName, r.leaderEmail, r.leaderMobile,
      r.projectName, r.category, r.department, r.section, memberCount, r.status, r.registeredAt,
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=neurvexa-registered-teams.csv");
  res.send(csv);
});

module.exports = router;
