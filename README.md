# NEURVEXA — AI Project Expo 2026

Full registration platform, split into three parts:

```
neurvexa-expo/
├── frontend/    React + Vite (UI)
├── backend/     Node + Express (API)
└── database/    SQL schema + notes
```

## Run it in VS Code

Open the `neurvexa-expo` folder in VS Code, then use **two terminals**
(Terminal → New Terminal, then split it) — one for the backend, one for
the frontend. Both must be running at the same time.

### 1. Backend (Terminal 1)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Runs on **http://localhost:5000**. It creates its own SQLite database file
(`backend/neurvexa.db`) automatically on first run — nothing else to set up.

### 2. Frontend (Terminal 2)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Runs on **http://localhost:5173** — open that in your browser.

## What's included

- **Landing page** — hero, live countdown (server-side deadline, not the
  browser clock), about, AI categories, guidelines, coordinators
- **5-step registration wizard** — team → members (max 4) → project →
  document upload → review & submit, with full validation
- **Status check page** — look up a registration by ID + email
- **Organizer panel** — passcode-gated list of all registered teams,
  status updates, CSV export (footer → "Organizer Access", passcode is
  `neurvexa2026` by default — change it in `backend/.env`)

## Notes for going to production

- Swap SQLite for Postgres/Supabase — see `database/README.md`
- Move file uploads from `backend/uploads/` to Supabase Storage or S3
- Replace the passcode gate in `backend/middleware/auth.js` with real auth
- Deploy the backend somewhere persistent (Render, Railway, Fly.io, etc.)
  and point `frontend/.env`'s `VITE_API_URL` at it
