-- ============================================================
-- TAG Educators — Seed a published Home page with a themed hero
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
-- ============================================================
-- It inserts ONE row into `pages` with slug='home', status='published',
-- and a single `hero` section whose data mirrors the static index.html
-- hero copy. Safe to re-run: it upserts (deletes existing 'home' first).
-- ============================================================

-- 1. Remove any existing home page so this is idempotent.
DELETE FROM pages
 WHERE slug = 'home';

-- 2. Insert the published home page with the themed hero section.
--    Build the sections jsonb programmatically so gen_random_uuid() runs
--    server-side (string-literal JSON would store it as literal text).
INSERT INTO pages (id, title, slug, status, sections, updated_at)
VALUES (
  gen_random_uuid(),
  'Home',
  'home',
  'published',
  jsonb_build_array(
    jsonb_build_object(
      'id',    gen_random_uuid(),
      'type',  'hero',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow',      'The Ark Global Educators',
        'title',        'Less Sinking.|More Sailing.',
        'description',  'TAG Educators matches O Level, A Level and IGCSE students with specialist tutors in small, focused batches - live online, wherever in the world you are.',
        'primaryCta',   jsonb_build_object('label', 'Explore Courses',   'href', '/courses'),
        'secondaryCta', jsonb_build_object('label', 'Meet Our Tutors',    'href', '/about')
      )
    )
  ),
  now()
);

-- 3. Verify it landed.
SELECT id, title, slug, status, jsonb_array_length(sections) AS section_count
  FROM pages
 WHERE slug = 'home';
