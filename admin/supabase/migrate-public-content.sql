-- TAG Educators public-content model migration.
-- Run this once against the existing Supabase project before seeding content.
-- It preserves admin/auth users and adds only the fields required by the public site.

alter table public.teachers
  add column if not exists role text not null default '',
  add column if not exists qualifications text[] not null default '{}',
  add column if not exists cambridge_certified boolean not null default false,
  add column if not exists image_query text not null default '',
  add column if not exists experience text not null default '',
  add column if not exists expertise text[] not null default '{}',
  add column if not exists badges text[] not null default '{}',
  add column if not exists stats jsonb not null default '[]'::jsonb;

alter table public.courses
  add column if not exists short_description text not null default '',
  add column if not exists long_description text not null default '',
  add column if not exists levels text[] not null default '{}',
  add column if not exists icon text not null default 'BookOpen',
  add column if not exists image_query text not null default '',
  add column if not exists category text not null default 'Sciences',
  add column if not exists topics text[] not null default '{}',
  add column if not exists what_you_will_learn text[] not null default '{}',
  add column if not exists benefits text[] not null default '{}';

alter table public.courses
  add column if not exists original_price numeric not null default 0;

alter table public.resources
  add column if not exists excerpt text not null default '',
  add column if not exists published_date date,
  add column if not exists read_time text not null default '',
  add column if not exists icon text not null default 'FileText',
  add column if not exists url text,
  add column if not exists topic text not null default '';

alter table public.testimonials
  add column if not exists poster text;

alter table public.pages
  add column if not exists parent_id uuid references public.pages(id) on delete set null,
  add column if not exists sort_order integer not null default 0;

alter table public.site_settings
  add column if not exists font text not null default 'Inter';

-- Remove content records only. Auth users are stored outside these tables.
truncate table public.pages, public.resources, public.testimonials, public.faqs,
  public.exam_timers, public.media_assets, public.teachers, public.courses,
  public.registrations restart identity cascade;
