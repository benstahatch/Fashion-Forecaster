create table if not exists trend_boards (
  id uuid primary key default gen_random_uuid(),
  name text,
  season text,
  year integer,
  created_at timestamp with time zone default now()
);
