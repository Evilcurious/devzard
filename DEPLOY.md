# DEVZARD — Deploy to Vercel + Neon

## 1) Neon DB (Postgres)
1. Go to https://neon.tech → Create project “devzard”
2. Copy **Connection string** (pooled, with `?sslmode=require`)
3. In Neon SQL Editor run:

```sql
CREATE TABLE IF NOT EXISTS devzard_kv (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Optional: view data
SELECT key, value FROM devzard_kv;
```

4. Test: All app data (attendance, announcements, HR, tickets, tasks, users) lives as JSON under keys like `devzard_attendance`, `devzard_announcements`, etc.

## 2) Vercel
1. Push this repo to GitHub: `Evilcurious/devzard` (branch `arena/c7a9f27f-devzard` → merge to main)
2. Vercel → Add New Project → Import GitHub repo
3. Framework preset: **Vite** (auto)
4. **Environment variables** (add both):
   - `DATABASE_URL` = your Neon connection string
   - `VITE_DATABASE_URL` = same (so client can detect Neon is enabled)
5. Deploy — Vercel runs `npm run build` → outputs `dist/` (single-file).
6. Custom domain: Vercel → Domains → Add `devzard.pk` etc.

## 3) How it works
- If `DATABASE_URL` is set, `api/kv.ts` (Vercel serverless) proxies all reads/writes to Neon.
- If not set, the app falls back to `localStorage` — works locally without any DB.
- No data loss on switch: when you first set Neon, old localStorage data stays in browser until you re-save (check-in, post announcement, etc.) which then writes to Neon.

## 4) Roles & permissions
- **Creator (owner)**: `evilcurious6@gmail.com` / `evil123` → full control, can promote anyone to IT CEO / BD CEO / HR via Staff Admin → Staff • Roles.
- **IT CEO**: manages IT team attendance (filtered) + assigns IT tasks (1st section)
- **BD CEO**: manages BD team + assigns BD tasks (2nd section)
- **HR**: punishments/policy + approve all leave tickets
- **Staff (IT/BD)**: check in/out, apply leave, see team tasks
- Login is email+password (same as site). Change role from dropdown; suspended users cannot log in.

## 5) Staff Portal routes
- `/staff` — main portal: Overview, Attendance (check-in/out), Announcements (ALL/IT/BD/HR), HR Channel, Leave Tickets, IT Team Work, BD Team Work
- `/staff/admin` — admin panel: Overview, Staff • Roles, Attendance Control, Announcements, HR Punishments, Leave Tickets, Tasks (IT/BD tabs), Permissions matrix
- `/admin` — legacy site admin (products/services/orders)

## 6) Theme & Language
- Theme: **Blackish (#050507) + white cards** — toggle via navbar Moon/Sun (global `dark` class, persisted in localStorage)
- Language: navbar `EN / اردو` button toggles `English ↔ Urdu` for all members (`devzard_lang` in localStorage, `dir="rtl"` when Urdu)

## 7) Local dev
```bash
npm install
npm run dev   # http://localhost:5173
```

## 8) Checklist
- [ ] Neon table created
- [ ] Vercel env `DATABASE_URL` set
- [ ] Redeploy → test check-in → verify row appears in Neon `SELECT * FROM devzard_kv;`
- [ ] Promote a test user to IT CEO / BD CEO / HR → verify they see correct tabs
