-- ================================================================
-- Project briefs from the contact form — run once in Supabase → SQL Editor.
--
-- Only the server (api/brief.js, using the service-role key from the
-- Vercel integration) can write or read this table. The website's public
-- key has no access at all: briefs are private.
-- Read them in Table Editor → briefs.
-- ================================================================

create table if not exists public.briefs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text check (char_length(name) <= 100),
  email       text not null check (char_length(email) <= 200),
  needs       text[] not null default '{}',
  budget      text check (char_length(budget) <= 40),
  timeline    text check (char_length(timeline) <= 40),
  message     text check (char_length(message) <= 5000),
  lang        text not null default 'en' check (lang in ('en', 'ar')),
  ip_hash     text,              -- one-way hash, only for the rate limit
  emailed     boolean not null default false
);

create index if not exists briefs_created_idx on public.briefs (created_at desc);
create index if not exists briefs_ip_recent_idx on public.briefs (ip_hash, created_at desc);

alter table public.briefs enable row level security;
revoke all on public.briefs from anon, authenticated;
grant select, insert on public.briefs to service_role;
-- no policies on purpose: only the service role (the server) gets in
