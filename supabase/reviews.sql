-- ================================================================
-- Reviews for the portfolio — run once in Supabase → SQL Editor.
--
-- Rules enforced by the database itself (not just the website):
--   • anyone can SUBMIT a review, but it is always stored unapproved
--   • visitors can only READ approved reviews
--   • you approve a review by ticking `approved` in Table Editor →
--     reviews; it then appears live on the site
-- ================================================================

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 80),
  role        text check (char_length(role) <= 100),
  service     text check (char_length(service) <= 60),
  project     text check (char_length(project) <= 80),   -- case-study slug, optional
  rating      smallint not null check (rating between 1 and 5),
  body        text not null check (char_length(body) between 10 and 1200),
  photo_url   text check (char_length(photo_url) <= 500),
  approved    boolean not null default false
);

create index if not exists reviews_approved_created_idx on public.reviews (approved, created_at desc);

alter table public.reviews enable row level security;

-- visitors see approved reviews only
drop policy if exists "read approved reviews" on public.reviews;
create policy "read approved reviews" on public.reviews
  for select to anon, authenticated
  using (approved = true);

-- anyone may submit, but never pre-approved
drop policy if exists "submit unapproved reviews" on public.reviews;
create policy "submit unapproved reviews" on public.reviews
  for insert to anon, authenticated
  with check (approved = false);

-- (no update/delete policies: only you, in the dashboard, can approve or remove)

-- live updates: approved reviews are pushed to open pages instantly
do $$
begin
  alter publication supabase_realtime add table public.reviews;
exception when duplicate_object then null;
end $$;

-- ---------- optional reviewer photos -------------------------------
-- public bucket, images only, 2 MB max (the site shrinks photos to
-- ~40 KB before upload anyway)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

drop policy if exists "upload review photos" on storage.objects;
create policy "upload review photos" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'review-photos');
