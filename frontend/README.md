# Pyramid — Task Management System

A full-stack task management app built for the Full Stack Developer (Fresher) technical
assessment. Users can sign in as a guest (or register/log in with an email + password),
manage tasks in a **List** or **Board (Kanban)** view, and switch between theme/accent-color
options that persist across refreshes.

**Tech stack**
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Database:** SQLite (via TypeORM + `better-sqlite3`)
- **Auth:** JWT stored in an `httpOnly` cookie, guest login + email/password login

---

## Project Structure

```
Pyramid/
├── backend/     # NestJS API (auth, users, tasks)
└── frontend/    # Next.js app (App Router)
```

## Features

- **Guest login** — jump in instantly with just a display name, no password required
- **Email/password auth** — register and log in, with `bcrypt`-hashed passwords
- **Session persistence** — JWT in an `httpOnly` cookie, restored via `GET /auth/me` on load
- **Task CRUD** — create, read, update, delete, all scoped to the logged-in user (ownership
  is checked server-side on every request, not just hidden in the UI)
- **List view** — tasks grouped by status (To Do / Doing / Completed) with inline status
  change and quick-add
- **Board view** — Kanban-style columns, shares the same data/hooks as the list view
- **Task detail page** — full edit and delete for a single task
- **Priority & due date** on each task
- **Theme system** — light/dark mode plus 6 accent colors (amber, blue, pink, rose, emerald,
  black), persisted **server-side on the user record** so it survives refresh and works across
  devices/sessions (not just `localStorage`)
- **Validation** — global `ValidationPipe` (whitelist + `forbidNonWhitelisted`) rejects any
  unexpected fields sent to the API

## Architecture Notes

- **Auth flow:** the backend issues a JWT and sets it as an `httpOnly`, `sameSite=lax` cookie
  (`secure` in production). The frontend never touches the token directly — every `fetch` call
  goes through a small `api` client (`frontend/src/lib/api.ts`) that always sends
  `credentials: 'include'`.
- **Guarding routes:** `JwtAuthGuard` reads the cookie, verifies the JWT, and attaches the user
  id to the request. It's applied at the controller level for `/tasks` and `/users`, so there's
  no route that accidentally skips auth.
- **Ownership checks:** every task lookup (`findOneForUser`) checks `task.ownerId` against the
  logged-in user before returning/mutating it — so even a guessed task ID from another user is
  rejected with a 403, not just filtered out of a list.
- **Database:** SQLite via `better-sqlite3` with `synchronize: true` for this assessment (fine
  for a fresher project / demo; a real production app would use migrations instead).

## Known Deviations from the Figma

> Document any place your implementation intentionally differs from the Figma design here —
> e.g. specific spacing, icon substitutions, or interactions you simplified — so reviewers know
> it was a conscious choice rather than something missed.

---

## Getting Started Locally

### Prerequisites
- Node.js 20+
- npm

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # adjust JWT_SECRET, ports, etc. as needed
npm run start:dev
```

Runs on **http://localhost:3000** by default. Environment variables (see `.env.example`):

| Variable        | Purpose                                      | Default                  |
|-----------------|-----------------------------------------------|---------------------------|
| `PORT`          | Port the API listens on                       | `3000`                    |
| `DATABASE_PATH` | Path to the SQLite file                       | `db.sqlite`               |
| `JWT_SECRET`    | Secret used to sign JWTs — **change in prod**  | (placeholder)             |
| `FRONTEND_URL`  | Allowed CORS origin (must match the deployed frontend URL, credentials included) | `http://localhost:3001` |

### 2. Frontend

```bash
cd frontend
npm install
# frontend/.env.local already points at the local backend by default:
# NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```

Runs on **http://localhost:3001** (configured via `next dev -p 3001` in `package.json`).

Open http://localhost:3001, log in as a guest (or register), and you'll land on `/tasks`.

---

