# Fashion-Forecaster

Fashion-Forecaster is a student-built fashion forecasting platform with a React frontend, an Express backend, Supabase for auth and application data, and Gemini-powered chatbot responses for fashion research prompts.

This repository contains the current working codebase for the Fashion-Forecaster project.

## Tools Needed

Before running the project, install:

- Node.js
- npm
- Git

You will also need access to:

- a Supabase project
- a Gemini API key
- a Pexels API key

## System Overview

- `client/my-react-app`: Vite + React frontend
- `server`: Express API and chatbot service
- Supabase:
  - frontend auth and direct table access
  - application data for profiles, colors, forecasts, stories, and trend boards
- External APIs:
  - Gemini for chatbot text generation
  - Pexels for market research imagery

## Local Development

### 1. Create environment files

Create these two files locally and keep the real values in them:

- `client/my-react-app/.env`
- `server/.env`

You can copy the examples in:

- `client/my-react-app/.env.example`
- `server/.env.example`

Frontend `.env` values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PEXELS_API_KEY`

Server `.env` values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `VITE_PEXELS_API_KEY`

Do not commit real API keys or secret values to GitHub.

### 2. Install dependencies

Frontend:

```bash
cd client/my-react-app
npm install
```

Server:

```bash
cd server
npm install
```

### 3. Run the server

Open a terminal in the server folder:

```bash
cd server
node server.js
```

The server runs on `http://localhost:3001`.

### 4. Run the client

Open a second terminal in the client folder:

```bash
cd client/my-react-app
npm run dev
```

Vite will print the local frontend URL in the terminal, usually `http://localhost:5173`.

### 5. Use the app

- Make sure the server is running before testing the chatbot.
- Make sure both `.env` files have valid values before signing in or using Supabase-backed features.

## Application Flow

### Auth and profiles

- The frontend signs users in and up through Supabase Auth.
- New users are expected to have a row in the `profiles` table.
- The frontend and server both include logic to create a profile row when needed.

### Color forecasting

- Colors are stored in Supabase and associated with authenticated users.
- Forecasts, forecast-color joins, color stories, and trend boards are also persisted in Supabase.

### Chatbot

- The React chatbot calls `POST /chat` on the Express server.
- The server reads fashion CSV data from `server/data` if available and falls back to hardcoded demo values when dataset files are missing.
- Gemini generates short editorial responses based on the loaded fashion data.

## Notes

- Keep secrets out of Git. Use `.env.example` files for variable names only.
- Use `main` as the stable branch.
- Use feature branches and pull requests for ongoing work.
