-- ============================================================
-- TAG Educators — Strip em dashes (—) from the seeded home hero
-- Run this in the Supabase SQL Editor.
-- ============================================================
-- Replaces the em dash in the hero description with a regular hyphen.
-- Idempotent: safe to re-run (no-op if no em dash remains).
-- ============================================================

UPDATE pages
   SET sections = jsonb_set(
         sections,
         '{0,data,description}',
         to_jsonb(
           replace(
             sections #>> '{0,data,description}',
             '—',
             '-'
           )
         )
       ),
       updated_at = now()
 WHERE slug = 'home'
   AND sections #>> '{0,data,description}' LIKE '%—%';

-- Verify
SELECT sections #>> '{0,data,description}' AS hero_description
  FROM pages
 WHERE slug = 'home';
