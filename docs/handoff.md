# Fashion-Forecaster Handoff Guide

This document is the operational guide for the teacher and the next semester's team.

## Recommended Ownership Model

### GitHub

- Canonical repository should be teacher-controlled.
- Do not depend on the historical upstream repository for future administration.
- Add at least two maintainers to the canonical repository:
  - course instructor
  - one backup technical maintainer

### Supabase

- Supabase should be controlled by the teacher, not by a graduating student's personal account.
- Add the teacher as an admin immediately.
- If Supabase allows project transfer for the current account plan, transfer ownership.
- If direct transfer is not available, recreate the project under the teacher's account using the live project as the source of truth.

## Recommended Repository Migration

### Target repository

Use one of these options, in order of preference:

1. Create a new repository under the teacher's GitHub account.
2. Transfer `benstahatch/Fashion-Forecaster` to the teacher if GitHub transfer rules and permissions allow it.
3. Keep `benstahatch/Fashion-Forecaster` as temporary canonical only until the teacher takes direct control.

### Branch to promote

- Treat `benji-on-kensey` as the handoff candidate branch.
- Validate it before promoting it to `main`.
- After validation, make that state the baseline for the teacher-controlled `main`.

### Promotion checklist

1. Clone the teacher-controlled repo into a clean directory.
2. Push the validated `benji-on-kensey` branch into that repository.
3. Open a pull request or fast-forward `main` to that branch after review.
4. Add branch protection to `main`.
5. Require pull requests for future semester work.

## Supabase Transfer Procedure

### Immediate safety steps

1. Log into the current Supabase project.
2. Add the teacher as an admin or owner-capable collaborator.
3. Confirm the teacher can access:
   - project settings
   - database editor
   - auth settings
   - API keys
   - storage
   - SQL editor

### If project transfer is available

1. Transfer the project to the teacher-owned account or team.
2. Confirm the project slug, URL, and keys that remain active.
3. Update local documentation with the final owner and access path.

### If project transfer is not available

1. Export or document the live project:
   - table schemas
   - row level security policies
   - auth settings
   - storage buckets
   - SQL snippets
   - API keys and environment variable names
2. Create a new Supabase project under the teacher's account.
3. Recreate the database structure from the live project.
4. Recreate auth settings and any required storage buckets.
5. Update app environment variables to point at the new project.
6. Smoke test login, profile creation, color forecasting, and chatbot-related reads.

## Secrets and Environment Variables

### Frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PEXELS_API_KEY`

### Server

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `VITE_PEXELS_API_KEY`

### Rules

- Never commit real values to Git.
- Rotate keys after the teacher takes ownership.
- Remove graduating students from privileged access once the handoff succeeds.

## Development Workflow for Next Semester

### Repository workflow

1. Branch from `main`.
2. Make a focused feature or fix branch.
3. Open a pull request into `main`.
4. Require teacher or designated maintainer review.
5. Merge only when the branch is tested and documented.

### Operational workflow

1. Read `README.md` and `docs/backend-inventory.md`.
2. Create local `.env` files from the `.env.example` templates.
3. Start the frontend and server locally.
4. Confirm Supabase auth works.
5. Confirm the chatbot can reach the local server.
6. Confirm color forecasting reads and writes work for a test user.

## First Walkthrough Session

The outgoing team should hold one walkthrough with the teacher and the incoming team covering:

1. Which repository is canonical.
2. Which Supabase project is canonical.
3. Where secrets are stored.
4. How users sign up and how `profiles` rows are created.
5. Which features depend on direct Supabase access.
6. Which features depend on the Express server.
7. What is incomplete or fragile in the current codebase.

## Known Risks

- The repository does not contain a complete Supabase migration history.
- Some Supabase-related SQL files in the repo are partial and should not be trusted as complete production setup.
- The server expects dataset files under `server/data`, but fallback demo data is used if they are missing.
- The chatbot is hardcoded to call `http://localhost:3001/chat` in local development code.
- The backend currently uses the Supabase anon key in the server environment, not a service-role key.

## Minimum Definition of a Successful Handoff

- The teacher controls the canonical GitHub repository.
- The teacher controls or can fully administer the canonical Supabase project.
- A clean clone can be run locally using only the docs and env templates in this repository.
- The next semester understands which branch history is legacy and which repository is canonical.
