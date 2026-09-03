-- ============================================================
-- NEURVEXA AI PROJECT EXPO — DATABASE SCHEMA
-- Works as-is on SQLite (used by backend/db.js out of the box).
-- To move to PostgreSQL / Supabase: change AUTOINCREMENT -> SERIAL,
-- TEXT -> appropriate types, and DATETIME DEFAULT CURRENT_TIMESTAMP
-- stays the same in Postgres.
-- ============================================================

CREATE TABLE IF NOT EXISTS registrations (
  id                TEXT PRIMARY KEY,        -- e.g. NVX-2026-00482
  team_name         TEXT NOT NULL,
  project_name      TEXT NOT NULL,
  project_title     TEXT NOT NULL,
  category          TEXT NOT NULL,
  college           TEXT NOT NULL,
  department        TEXT NOT NULL,
  section           TEXT NOT NULL,
  year_of_study     TEXT NOT NULL,
  city              TEXT NOT NULL,

  leader_name       TEXT NOT NULL,
  leader_email      TEXT NOT NULL,
  leader_mobile     TEXT NOT NULL,
  leader_reg_no     TEXT,

  ai_domain         TEXT NOT NULL,
  ai_model          TEXT,
  dataset           TEXT,
  languages         TEXT,
  frameworks        TEXT,
  technologies      TEXT,
  project_status    TEXT NOT NULL DEFAULT 'Idea',
  abstract          TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  solution          TEXT NOT NULL,
  expected_outcome  TEXT,
  github_url        TEXT,
  demo_url          TEXT,
  video_url         TEXT,

  status            TEXT NOT NULL DEFAULT 'REGISTERED', -- REGISTERED | UNDER_REVIEW | APPROVED | REJECTED
  registered_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id   TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  member_order      INTEGER NOT NULL,        -- 2, 3, or 4 (leader is stored on registrations row itself)
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  mobile            TEXT NOT NULL,
  college           TEXT NOT NULL,
  department        TEXT NOT NULL,
  section           TEXT NOT NULL,
  year_of_study     TEXT NOT NULL,
  reg_no            TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS uploaded_files (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id   TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  slot              TEXT NOT NULL,            -- abstractPdf | presentation | poster | video | supporting
  original_name     TEXT NOT NULL,
  stored_path       TEXT NOT NULL,
  size_bytes         INTEGER NOT NULL,
  uploaded_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reg_leader_email ON registrations(leader_email);
CREATE INDEX IF NOT EXISTS idx_reg_team_name ON registrations(team_name);
CREATE INDEX IF NOT EXISTS idx_reg_project_name ON registrations(project_name);
CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(status);
