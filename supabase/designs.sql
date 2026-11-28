-- ================================================================
-- Studio designs — run once in Supabase → SQL Editor.
--
--   • anyone can SEND a design from /studio, always stored unapproved
--   • visitors can only SEE approved designs (the gallery on /studio)
--   • approve by ticking `approved` in Table Editor → designs;
--     delete a row (and its file in Storage → designs) to remove it
-- ================================================================

create table if not exists public.designs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 80),
  title       text check (char_length(title) <= 80),
  image_url   text not null check (char_length(image_url) <= 500),
  approved    boolean not null default false
);

create index if not exists designs_approved_created_idx on public.designs (approved, created_at desc);

alter table public.designs enable row level security;

revoke all on public.designs from anon, authenticated;
grant select, insert on public.designs to anon, authenticated;

drop policy if exists "read approved designs" on public.designs;
create policy "read approved designs" on public.designs
  for select to anon, authenticated
  using (approved = true);

drop policy if exists "send unapproved designs" on public.designs;
create policy "send unapproved designs" on public.designs
  for insert to anon, authenticated
  with check (approved = false);

-- images: WebP only, 3 MB max (the site exports ~1200×750 WebP, usually < 300 KB).
-- Files get random names, so an unapproved design is only reachable by
-- someone who already has its exact link.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('designs', 'designs', true, 3145728, array['image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 3145728, allowed_mime_types = array['image/webp'];

drop policy if exists "upload designs" on storage.objects;
create policy "upload designs" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'designs');
