# Fashion-Forecaster

Fashion-Forecaster is a student-built fashion forecasting platform with a React frontend, an Express backend, Supabase for auth and application data, and Gemini-powered chatbot responses for fashion research prompts.

This repository is now structured for semester-to-semester handoff. Start with the documents below before making changes:

- `docs/handoff.md`: operational handoff, ownership transfer steps, and team workflow
- `docs/backend-inventory.md`: current backend dependencies, known Supabase tables, and reconstruction checklist

## System Overview

- `client/my-react-app`: Vite + React frontend
- `server`: Express API and chatbot service
- Supabase:
  - frontend auth and direct table access
  - application data for profiles, colors, forecasts, stories, and trend boards
- External APIs:
  - Gemini for chatbot text generation
  - Pexels for market research imagery

## Current Branching Context

- Local handoff branch: `benji-on-kensey`
- Historical upstream repo: `Kensey-McDowell/Fashion-Forecaster`
- Recommended canonical future home: a teacher-controlled repository

Do not assume the historical upstream repository is the long-term source of truth. The next semester should work from a teacher-controlled repository and teacher-controlled Supabase access.

## Local Development

### Frontend

```bash
cd client/my-react-app
npm install
npm run dev
```

Required frontend environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PEXELS_API_KEY`

### Server

```bash
cd server
npm install
node server.js
```

The server runs on `http://localhost:3001`.

Required server environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `VITE_PEXELS_API_KEY`

## Application Flow

### Auth and profiles

- The frontend signs users in and up through Supabase Auth.
- New users are expected to have a row in the `profiles` table.
- The frontend and server both include logic to create a profile row when needed.

### Color forecasting

- Colors are stored in Supabase and associated with authenticated users.
- Forecasts, forecast-color joins, color stories, and trend boards are also persisted in Supabase.
- Some SQL setup files for the color forecasting feature are checked into the repo, but they are not a complete backend source of truth.

### Chatbot

- The React chatbot calls `POST /chat` on the Express server.
- The server reads fashion CSV data from `server/data` if available and falls back to hardcoded demo values when dataset files are missing.
- Gemini generates short editorial responses based on the loaded fashion data.

## Handoff Rules

- Keep secrets out of Git. Use `.env.example` files for names only.
- Treat `main` as deployable.
- Use pull requests for all semester work.
- Protect the canonical repository with at least two maintainers.
- Preserve Supabase access under teacher ownership, not a student personal account.
