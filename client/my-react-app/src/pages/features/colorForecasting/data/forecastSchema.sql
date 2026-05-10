create table if not exists color_stories (
  id uuid primary key default gen_random_uuid(),
  jke,  forecast_id uuid references forecasts(id) on delete cascade,
  narrative text,
  design_application text,
  fabric_suggestions text,
  created_at timestamp with time zone default now()
);

create table if not exists fashion_collections (
  id uuid primary key default gen_random_uuid(),
  designer text,
  brand text,
  season text,
  year integer,
  description text,
  palette jsonb,
  created_at timestamp with time zone default now()
);
