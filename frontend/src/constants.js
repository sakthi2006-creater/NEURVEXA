export const COORDINATORS = [
  { name: "R. Sakthivel", role: "Event Coordinator", phone: "93615 06217", email: "sakthi31072006@gmail.com" },
  { name: "Mohan Raj E", role: "Event Coordinator", phone: "93442 05987", email: "" },
  { name: "Sanjay. S", role: "Event Coordinator", phone: "82701 50136", email: "" },
  { name: "Nishal Ahamed I", role: "Student Coordinator", phone: "87546 26795", email: "" },
  { name: "Anto Kingsley D", role: "Student Coordinator", phone: "63749 25684", email: "" },
  { name: "Santha kumar N", role: "Student Coordinator", phone: "93615 83518", email: "" },
];

export const SECTIONS = ["A", "B", "C"];

export const CATEGORIES = [
  { id: "ai", name: "Artificial Intelligence", icon: "✦" },
  { id: "ml", name: "Machine Learning", icon: "◈" },
  { id: "dl", name: "Deep Learning", icon: "◎" },
];

export const GUIDELINES = [
  "Maximum 4 members per team.",
  "Team leader is counted as one member.",
  "Registration opens on 28 August 2026.",
  "Registration closes on 5 September 2026.",
  "All submitted information must be accurate.",
  "Each team should submit one project.",
  "Project details must be submitted before final registration.",
  "Uploaded documents must follow the required formats.",
  "Organizers reserve the right to verify submissions.",
  "Duplicate or misleading registrations may be rejected.",
];

export const UPLOAD_SLOTS = [
  ["abstractPdf", "PROJECT ABSTRACT", "PDF", 10, [".pdf"]],
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_RE = /^[6-9]\d{9}$/;
export const URL_RE = /^(https?:\/\/)[^\s]+\.[^\s]+$/;

export function pad(n) {
  return String(n).padStart(2, "0");
}
