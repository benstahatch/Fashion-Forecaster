# Backend Inventory

This document records what the current codebase expects from the backend. Supabase is the system of record for the database and authentication layer.

## Architecture

### Frontend

- Location: `client/my-react-app`
- Uses Supabase directly for auth and most application data reads and writes
- Uses Pexels from the client for market research imagery
- Calls the Express chatbot at `http://localhost:3001/chat`

### Server

- Location: `server/server.js`
- Uses Express with JSON and CORS enabled
- Uses Supabase for auth-adjacent profile bootstrapping and CRUD endpoints
- Uses Gemini through `@ai-sdk/google`
- Loads CSV fashion data from `server/data` if present

## Environment Variables

### Frontend env

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PEXELS_API_KEY`

### Server env

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `VITE_PEXELS_API_KEY`

## Known Supabase Usage

### Auth

- Supabase Auth handles sign-in and sign-up.
- User metadata stores:
  - `full_name`
  - `requested_role`

### Tables referenced in code

- `profiles`
- `colors`
- `pantone_colors`
- `forecasts`
- `forecast_colors`
- `color_stories`
- `fashion_collections`
- `trend_boards`
- `trend_board_colors`

### Table behavior inferred from code

- `profiles`
  - expected columns: `id`, `name`, `email`, `role`
  - `id` appears to map to Supabase Auth user id

- `colors`
  - expected columns include: `id`, `user_id`, `name`, `hex`, `season`, `pantone_color_id`, `match_distance`, `is_pantone_matched`, `created_at`

- `pantone_colors`
  - expected columns include: `id`, `r`, `g`, `b`
  - used for nearest-Pantone matching

- `forecasts`
  - expected columns include: `id`, `user_id`, `season`, `theme_name`, `cultural_context`, `target_market`, `inspiration`, `created_at`

- `forecast_colors`
  - join table between forecasts and colors
  - expected columns include: `forecast_id`, `color_id`, `user_id`

- `color_stories`
  - expected columns include: `id`, `user_id`, `color_id`, `forecast_id`, `narrative`, `design_application`, `fabric_suggestions`, `created_at`

- `fashion_collections`
  - expected columns include: `id`, `user_id`, `designer`, `brand`, `season`, `year`, `description`, `palette`, `created_at`

- `trend_boards`
  - expected columns include: `id`, `user_id`, `name`, `season`, `year`, `created_at`

- `trend_board_colors`
  - join table between trend boards and colors
  - expected columns include: `board_id`, `color_id`, `user_id`
  - code expects a uniqueness constraint on `(board_id, color_id)`

## Server Endpoints

### Chatbot

- `POST /chat`

### Auth and profiles

- `POST /api/auth/signin`
- `POST /api/auth/signup`
- `POST /api/profile/bootstrap`
- `GET /api/profile/:userId`

### Colors and Pantone

- `GET /api/colors`
- `GET /api/colors/:id`
- `POST /api/colors`
- `PATCH /api/colors/:id`
- `DELETE /api/colors/:id`
- `GET /api/pantone`

### Forecasting and stories

- `GET /api/forecasts`
- `GET /api/forecasts/:id`
- `POST /api/forecasts`
- `POST /api/forecast_colors`
- `GET /api/forecast_colors/:forecastId`
- `POST /api/color_stories`
- `GET /api/color_stories/color/:colorId`
- `GET /api/color_stories/:id`
- `PATCH /api/color_stories/:id`
- `DELETE /api/color_stories/:id`

### Collections and boards

- `GET /api/collections`
- `POST /api/collections`
- `GET /api/trend-boards`
- `POST /api/trend-boards`
- `PATCH /api/trend-boards/:boardId`
- `DELETE /api/trend-boards/:boardId`
- `POST /api/trend-board-colors`
- `GET /api/trend-board-colors/:boardId`
- `DELETE /api/trend-board-colors/:boardId/:colorId`

## Reconstruction Checklist

1. Export or manually record every live Supabase table definition.
2. Export or record every RLS policy.
3. Confirm whether email confirmation is required for sign-up.
4. Confirm whether any storage buckets are used outside what is visible in code.
5. Rebuild the project under teacher ownership if direct transfer is unavailable.
6. Test:
   - sign-up
   - sign-in
   - profile creation
   - color CRUD
   - trend board CRUD
   - forecast and color story CRUD
   - chatbot access
