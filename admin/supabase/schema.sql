-- ============================================================
-- TAG Educators — Supabase schema setup
-- Run this entire script in: Supabase Dashboard → SQL Editor → New query
-- It is idempotent — safe to re-run (uses IF NOT EXISTS / OR REPLACE).
-- ============================================================

-- ------------------------------------------------------------
-- Extensions
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";   -- for gen_random_uuid()

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

-- Teachers / Faculty
create table if not exists public.teachers (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  photo           text,
  role            text not null default '',
  description     text not null default '',
  qualifications  text[] not null default '{}',
  subjects        text[] not null default '{}',
  levels          text[] not null default '{}',
  years_experience integer not null default 0,
  cambridge_certified boolean not null default false,
  image_query     text not null default '',
  experience      text not null default '',
  expertise       text[] not null default '{}',
  badges          text[] not null default '{}',
  stats           jsonb not null default '[]'::jsonb,
  featured        boolean not null default false,
  updated_at      timestamptz not null default now()
);

-- Courses
create table if not exists public.courses (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  short_description text not null default '',
  long_description text not null default '',
  levels          text[] not null default '{}',
  level           text not null,
  subject         text not null,
  icon            text not null default 'BookOpen',
  image_query     text not null default '',
  category        text not null default 'Sciences',
  topics          text[] not null default '{}',
  what_you_will_learn text[] not null default '{}',
  benefits        text[] not null default '{}',
  teacher_ids     uuid[] not null default '{}',
  price           numeric not null default 0,
  original_price   numeric not null default 0,
  currency        text not null default 'PKR',
  status          text not null default 'draft',
  featured        boolean not null default false,
  start_date      date,
  batch_size      integer not null default 0,
  updated_at      timestamptz not null default now()
);

-- Resources
create table if not exists public.resources (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text not null default '',
  type            text not null,
  subject         text not null,
  level           text not null,
  topic           text not null default '',
  published_date  date,
  read_time       text not null default '',
  icon            text not null default 'FileText',
  url             text,
  featured        boolean not null default false,
  updated_at      timestamptz not null default now()
);

-- Testimonials
create table if not exists public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  student_name    text not null,
  course          text not null,
  result          text not null,
  quote           text not null,
  featured        boolean not null default false,
  video_url       text,
  poster          text
);

-- FAQs
create table if not exists public.faqs (
  id              uuid primary key default gen_random_uuid(),
  question        text not null,
  answer          text not null,
  category        text not null default 'General',
  sort_order      integer not null default 0
);

-- Registrations (student enrollments — private)
create table if not exists public.registrations (
  id              uuid primary key default gen_random_uuid(),
  student_name    text not null,
  parent_name     text not null default '',
  email           text not null,
  phone           text not null,
  location        text not null default '',
  parent_phone    text not null default '',
  courses         text[] not null default '{}',
  status          text not null default 'new',
  created_at      timestamptz not null default now()
);

-- Contact enquiries (messages from the public contact form — private)
create table if not exists public.contact_enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null default '',
  subject     text not null default '',
  message     text not null,
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);

-- Exam timers
create table if not exists public.exam_timers (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  board           text not null,
  level           text not null,
  subject         text not null,
  exam_date       timestamptz not null,
  active          boolean not null default true,
  featured        boolean not null default false
);

-- Pages (site pages built in the page builder)
-- sections is a JSONB array of Section objects: {id, type, hidden, data}
create table if not exists public.pages (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  status          text not null default 'draft',
  sections        jsonb not null default '[]'::jsonb,
  draft_sections  jsonb,
  parent_id       uuid references public.pages(id) on delete set null,
  sort_order      integer not null default 0,
  updated_at      timestamptz not null default now()
);

-- Media assets (metadata for files uploaded to the storage bucket)
create table if not exists public.media_assets (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  url             text not null,
  alt             text not null default '',
  size_kb         integer not null default 0,
  width           integer not null default 0,
  height          integer not null default 0,
  updated_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Row Level Security
-- Automatic RLS is enabled, so policies are required for access.
-- Strategy:
--   Public content tables → anyone can SELECT (anon key is public anyway)
--   Private tables        → no public access (admin auth wired later)
--   All tables            → writes restricted until admin auth is added
-- ------------------------------------------------------------

-- Helper: enable RLS on every table (no-op if already enabled)
-- Navigation items (menu links managed by admin, read by public site)
create table if not exists public.navigation_items (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  href        text not null,
  position    integer not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Site settings (single-row table — enforced by check constraint)
create table if not exists public.site_settings (
  id              integer primary key default 1 check (id = 1),
  site_name       text not null default 'TAG Educators',
  tagline         text not null default '',
  description     text not null default '',
  email           text not null default '',
  phone           text not null default '',
  address         text not null default '',
  instagram       text not null default '',
  facebook        text not null default '',
  youtube         text not null default '',
  domain          text not null default '',
  meta_description text not null default '',
  font             text not null default 'Inter',
  updated_at      timestamptz not null default now()
);

-- Seed the single row so fetchSettings always finds it
insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.teachers        enable row level security;
alter table public.courses         enable row level security;
alter table public.resources       enable row level security;
alter table public.testimonials    enable row level security;
alter table public.faqs            enable row level security;
alter table public.registrations   enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.exam_timers     enable row level security;
alter table public.pages           enable row level security;
alter table public.media_assets    enable row level security;
alter table public.site_settings   enable row level security;
alter table public.navigation_items enable row level security;

-- Public read policies (site visitors)
drop policy if exists "public read teachers"      on public.teachers;
drop policy if exists "public read courses"       on public.courses;
drop policy if exists "public read resources"     on public.resources;
drop policy if exists "public read testimonials"  on public.testimonials;
drop policy if exists "public read faqs"          on public.faqs;
drop policy if exists "public read exam_timers"   on public.exam_timers;
drop policy if exists "public read pages"         on public.pages;
drop policy if exists "public read media_assets" on public.media_assets;

create policy "public read teachers"      on public.teachers      for select using (true);
create policy "public read courses"        on public.courses       for select using (true);
create policy "public read resources"      on public.resources     for select using (true);
create policy "public read testimonials"   on public.testimonials  for select using (true);
create policy "public read faqs"           on public.faqs          for select using (true);
create policy "public read exam_timers"    on public.exam_timers   for select using (true);
create policy "public read pages"          on public.pages         for select using (true);
create policy "public read media_assets"   on public.media_assets  for select using (true);

drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings for select using (true);

drop policy if exists "public read navigation_items" on public.navigation_items;
create policy "public read navigation_items" on public.navigation_items for select using (true);

-- Public form submissions (site visitors can INSERT but never read)
drop policy if exists "anon insert registrations" on public.registrations;
create policy "anon insert registrations" on public.registrations
  for insert to anon with check (true);

drop policy if exists "anon insert contact_enquiries" on public.contact_enquiries;
create policy "anon insert contact_enquiries" on public.contact_enquiries
  for insert to anon with check (true);

-- NOTE on writes:
-- For now, during development, we allow authenticated writes on all tables.
-- Once admin auth is wired (Supabase Auth), these policies will be tightened
-- to require an admin role. The anon key alone cannot write because these
-- policies require `auth.role() = 'authenticated'`.
drop policy if exists "auth write teachers"      on public.teachers;
drop policy if exists "auth write courses"       on public.courses;
drop policy if exists "auth write resources"     on public.resources;
drop policy if exists "auth write testimonials"  on public.testimonials;
drop policy if exists "auth write faqs"          on public.faqs;
drop policy if exists "auth write registrations"  on public.registrations;
drop policy if exists "auth write contact_enquiries" on public.contact_enquiries;
drop policy if exists "auth write exam_timers"   on public.exam_timers;
drop policy if exists "auth write pages"         on public.pages;
drop policy if exists "auth write media_assets"  on public.media_assets;

create policy "auth write teachers"      on public.teachers      for all to authenticated using (true) with check (true);
create policy "auth write courses"        on public.courses       for all to authenticated using (true) with check (true);
create policy "auth write resources"      on public.resources      for all to authenticated using (true) with check (true);
create policy "auth write testimonials"   on public.testimonials  for all to authenticated using (true) with check (true);
create policy "auth write faqs"           on public.faqs          for all to authenticated using (true) with check (true);
create policy "auth write registrations"  on public.registrations  for all to authenticated using (true) with check (true);
create policy "auth write contact_enquiries" on public.contact_enquiries for all to authenticated using (true) with check (true);
create policy "auth write exam_timers"    on public.exam_timers   for all to authenticated using (true) with check (true);
create policy "auth write pages"          on public.pages         for all to authenticated using (true) with check (true);
create policy "auth write media_assets"    on public.media_assets  for all to authenticated using (true) with check (true);

drop policy if exists "auth write site_settings" on public.site_settings;
create policy "auth write site_settings" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "auth write navigation_items" on public.navigation_items;
create policy "auth write navigation_items" on public.navigation_items for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- Storage bucket + policies
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read: anyone can read files in the media bucket
drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');

-- Authenticated upload: only logged-in users can upload
drop policy if exists "auth upload media bucket" on storage.objects;
create policy "auth upload media bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

-- Authenticated update/delete
drop policy if exists "auth update media bucket" on storage.objects;
create policy "auth update media bucket" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "auth delete media bucket" on storage.objects;
create policy "auth delete media bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ------------------------------------------------------------
-- Updated-at trigger (auto-bump updated_at on row change)
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_teachers_updated_at     on public.teachers;
drop trigger if exists trg_courses_updated_at      on public.courses;
drop trigger if exists trg_resources_updated_at    on public.resources;
drop trigger if exists trg_media_assets_updated_at on public.media_assets;
drop trigger if exists trg_pages_updated_at        on public.pages;

create trigger trg_teachers_updated_at     before update on public.teachers      for each row execute function public.set_updated_at();
create trigger trg_courses_updated_at      before update on public.courses       for each row execute function public.set_updated_at();
create trigger trg_resources_updated_at    before update on public.resources     for each row execute function public.set_updated_at();
create trigger trg_media_assets_updated_at before update on public.media_assets  for each row execute function public.set_updated_at();
create trigger trg_pages_updated_at        before update on public.pages         for each row execute function public.set_updated_at();

-- Done.
