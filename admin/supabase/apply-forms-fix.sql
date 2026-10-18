-- ============================================================
-- TAG Educators — Fix form submissions (registrations + contact)
-- Run this ONCE in the Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. New columns on registrations (form collects location + parent phone)
alter table public.registrations
  add column if not exists location     text not null default '',
  add column if not exists parent_phone text not null default '';

-- 2. Contact enquiries table (used by the website contact form)
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

alter table public.contact_enquiries enable row level security;

-- 3. Let the public website INSERT (but never read) form submissions
drop policy if exists "anon insert registrations" on public.registrations;
create policy "anon insert registrations"
  on public.registrations for insert to anon with check (true);

drop policy if exists "anon insert contact_enquiries" on public.contact_enquiries;
create policy "anon insert contact_enquiries"
  on public.contact_enquiries for insert to anon with check (true);

-- 4. Admin (authenticated) can manage contact_enquiries
drop policy if exists "auth write contact_enquiries" on public.contact_enquiries;
create policy "auth write contact_enquiries"
  on public.contact_enquiries for all to authenticated using (true) with check (true);

-- Done! Verify with:
-- select * from pg_policies where tablename in ('registrations','contact_enquiries');
