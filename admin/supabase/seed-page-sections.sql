-- ============================================================
-- TAG Educators — Seed Home & About page sections
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
-- Idempotent: deletes existing 'home' and 'about' pages first.
-- ============================================================

-- 1. Remove existing pages so this is idempotent
DELETE FROM pages WHERE slug IN ('home', 'about');

-- 2. Insert the published Home page with all sections
INSERT INTO pages (id, title, slug, status, sections, updated_at)
VALUES (
  gen_random_uuid(),
  'Home',
  'home',
  'published',
  jsonb_build_array(
    -- Hero
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'hero',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'The Ark Global Educators',
        'title', 'Learn From Experts.|Build Your Future.',
        'description', 'TAG Educators matches O Level, A Level and IGCSE students with specialist tutors in small, focused batches - live online, wherever in the world you are.',
        'primaryCta', jsonb_build_object('label', 'Explore Courses', 'href', '/courses'),
        'secondaryCta', jsonb_build_object('label', 'Meet Our Tutors', 'href', '/faculty')
      )
    ),
    -- Statistics (Trust section)
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'statistics',
      'hidden', false,
      'data', jsonb_build_object(
        'title', 'By the numbers',
        'stats', jsonb_build_array(
          jsonb_build_object('value', '8', 'label', 'Subjects Taught'),
          jsonb_build_object('value', '3', 'label', 'Levels - O, A & IGCSE'),
          jsonb_build_object('value', '2', 'label', 'Cambridge-Certified Tutors'),
          jsonb_build_object('value', '100%', 'label', 'Exam-Sat Faculty')
        )
      )
    ),
    -- Features (first cardGrid)
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'cardGrid',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'What You Get',
        'title', 'Not just a video call',
        'description', 'A full loop of practice, feedback and support around every session - designed to keep students moving forward between classes.',
        'columns', '3',
        'cards', jsonb_build_array(
          jsonb_build_object('icon', 'Users', 'title', 'Small-batch classes', 'description', 'Tutor-led micro-cohorts, kept small enough that every student still gets real attention.'),
          jsonb_build_object('icon', 'FileText', 'title', 'Past-paper sessions', 'description', 'Regular sessions built entirely around solving real, timed past papers - not just theory.'),
          jsonb_build_object('icon', 'MessageCircle', 'title', 'WhatsApp support', 'description', 'Direct WhatsApp access to your tutor between sessions for quick questions.'),
          jsonb_build_object('icon', 'ClipboardCheck', 'title', 'Attendance & progress reports', 'description', 'Parents get regular attendance and progress updates - not silence between report cards.'),
          jsonb_build_object('icon', 'Video', 'title', 'Recorded sessions', 'description', 'Every session is recorded, so students can rewatch anything that didn''t stick the first time.'),
          jsonb_build_object('icon', 'GraduationCap', 'title', 'Quizzes & tests', 'description', 'Short quizzes and periodic tests to check what''s actually sticking, not just what''s been covered.')
        )
      )
    ),
    -- Why TAG (second cardGrid)
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'cardGrid',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'The TAG Advantage',
        'title', 'Why Learn With TAG Educators?',
        'description', 'We are not a tutoring marketplace. We are a focused team of subject specialists who have been through these exact exams - and know how to get students through them too.',
        'columns', '4',
        'cards', jsonb_build_array(
          jsonb_build_object('icon', 'Award', 'title', 'Expert Faculty', 'description', 'Learn from experienced educators who have sat these exact Cambridge exams and teach at O & A Level schools.'),
          jsonb_build_object('icon', 'Target', 'title', 'Practical Learning', 'description', 'Focus on useful and applicable knowledge - real past-paper practice, not just theory.'),
          jsonb_build_object('icon', 'Map', 'title', 'Structured Courses', 'description', 'Clear learning paths mapped to the current Cambridge syllabus for each subject.'),
          jsonb_build_object('icon', 'HeartHandshake', 'title', 'Supportive Environment', 'description', 'A learning experience designed around students - small batches, WhatsApp support, recorded sessions.')
        )
      )
    ),
    -- Testimonial Reel
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'testimonialReel',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'Student Voices',
        'title', 'Hear It From Our Students',
        'testimonialIds', '[]'::jsonb
      )
    ),
    -- Testimonial Grid (Steps/Results)
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'testimonialGrid',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'Student Stories',
        'title', 'Real Students, Real Results',
        'description', '',
        'testimonialIds', '[]'::jsonb,
        'columns', '3'
      )
    ),
    -- CTA
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'cta',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'Get Started',
        'heading', 'Ready to Start Learning?',
        'description', 'Explore our courses and find the right learning path for you. Your journey to A* starts here.',
        'primaryCta', jsonb_build_object('label', 'Explore Courses', 'href', '/courses'),
        'secondaryCta', jsonb_build_object('label', 'Contact Us', 'href', 'https://wa.me/923162165779')
      )
    )
  ),
  now()
);

-- 3. Insert the published About page with sections
INSERT INTO pages (id, title, slug, status, sections, updated_at)
VALUES (
  gen_random_uuid(),
  'About',
  'about',
  'published',
  jsonb_build_array(
    -- Hero (page header)
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'hero',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'About Us',
        'title', 'The Ark Global Educators',
        'description', 'TAG Educators is a small-batch, specialist tutoring platform for Cambridge O Level, A Level and IGCSE students. We match students with tutors who''ve sat these exact exams - and keep batches small enough that every student still gets real attention.'
      )
    ),
    -- About points (first cardGrid)
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'cardGrid',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'What Makes Us Different',
        'title', 'Three Things That Define TAG',
        'columns', '1',
        'cards', jsonb_build_array(
          jsonb_build_object('title', '1. Experienced Tutors Who''ve Sat These Exams', 'description', 'Every TAG tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college. Two of our faculty are also formally Cambridge certified. This means insider knowledge of exact exam traps, mark-scheme language, and the specific techniques that earn marks - not just subject knowledge.'),
          jsonb_build_object('title', '2. Small Batches, Real Attention', 'description', 'We keep batches deliberately small and tutor-led. No 40-student Zoom calls. No recorded lectures pretending to be "online learning." Every student gets noticed, gets questions answered, and gets real attention from their tutor throughout the course.'),
          jsonb_build_object('title', '3. Built for Any Time Zone', 'description', 'Sessions run fully online, so scheduling is built around what works for your family - wherever in the world you are. Whether you''re in Karachi, Dubai, London or Toronto, we''ll find a slot that works.')
        )
      )
    ),
    -- Values (second cardGrid)
    jsonb_build_object(
      'id', gen_random_uuid(),
      'type', 'cardGrid',
      'hidden', false,
      'data', jsonb_build_object(
        'eyebrow', 'Our Values',
        'title', 'What We Stand For',
        'columns', '4',
        'cards', jsonb_build_array(
          jsonb_build_object('icon', 'Award', 'title', 'Expert Faculty', 'description', 'Learn from experienced educators who''ve sat these exact Cambridge papers.'),
          jsonb_build_object('icon', 'Target', 'title', 'Practical Learning', 'description', 'Focus on useful and applicable knowledge, built around real exam technique.'),
          jsonb_build_object('icon', 'Map', 'title', 'Structured Courses', 'description', 'Clear learning paths for students, mapped to the current syllabus.'),
          jsonb_build_object('icon', 'HeartHandshake', 'title', 'Supportive Environment', 'description', 'Small batches designed around students - real attention from your tutor.')
        )
      )
    )
  ),
  now()
);

-- 4. Seed navigation items
DELETE FROM navigation_items WHERE 1=1;

INSERT INTO navigation_items (label, href, position, visible) VALUES
  ('Home', '/', 0, true),
  ('Courses', '/courses', 1, true),
  ('Faculty', '/faculty', 2, true),
  ('Resources', '/resources', 3, true),
  ('About', '/about', 4, true),
  ('Contact', '/contact', 5, true);

-- 5. Verify
SELECT slug, title, status, jsonb_array_length(sections) AS section_count
  FROM pages
 WHERE slug IN ('home', 'about')
 ORDER BY slug;

SELECT label, href, position, visible FROM navigation_items ORDER BY position;
