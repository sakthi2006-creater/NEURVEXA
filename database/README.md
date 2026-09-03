# Database

This project uses **SQLite** by default (via `better-sqlite3` in the backend) so it
runs immediately in VS Code with zero setup — no external database server needed.

- The schema in `schema.sql` is applied automatically when the backend starts
  (see `backend/db.js`). The actual database file is created at
  `backend/neurvexa.db` on first run.
- `uploaded_files` and `team_members` reference `registrations` by its
  `id` (the human-readable registration ID, e.g. `NVX-2026-00482`).

## Moving to PostgreSQL / Supabase (production)

The schema is intentionally close to standard SQL so it ports easily:

1. Create a new Postgres database (Supabase → Project → Database).
2. Run `schema.sql` in the Supabase SQL editor, changing:
   - `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
   - `DATETIME DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMPTZ DEFAULT now()`
3. Swap `backend/db.js` to use `pg` (node-postgres) or the Supabase JS client
   instead of `better-sqlite3`, pointing at your `DATABASE_URL`.
4. Move file uploads from `backend/uploads/` (local disk) to a Supabase
   Storage bucket, and store the returned public/signed URL in
   `uploaded_files.stored_path` instead of a local path.
5. Add Supabase Auth (or any real auth provider) in place of the simple
   passcode check in `backend/middleware/auth.js`.

Everything else (routes, validation, frontend) stays the same — only the
data-access layer changes.
