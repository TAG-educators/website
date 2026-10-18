# Supabase Setup

This admin is wired to Supabase. Follow these steps to finish setup.

## 1. Environment variables

`.env.local` is already created (gitignored). It contains:

- `NEXT_PUBLIC_SUPABASE_URL` — your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key (safe for browser)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — newer-format publishable key
- `SUPABASE_DB_URL` — direct Postgres URL (replace `[YOUR-PASSWORD]` with the password you saved when creating the project; only needed for server-side tooling)

## 2. Create the database schema

1. Open your Supabase dashboard → **SQL Editor** → **New query**
2. Open `admin/supabase/schema.sql` from this repo
3. Copy the entire file contents and paste into the SQL editor
4. Click **Run**

This creates:
- 9 tables: `teachers`, `courses`, `resources`, `testimonials`, `faqs`, `registrations`, `exam_timers`, `pages`, `media_assets`
- Row Level Security policies (public read, authenticated write)
- A public `media` storage bucket (for photo/file uploads)
- Auto-updating `updated_at` triggers

The script is idempotent — safe to re-run.

## 3. Migrate the existing project to public-site content

If this Supabase project already contains the old CMS schema, run
`admin/supabase/migrate-public-content.sql` in the SQL Editor after
`schema.sql`. It adds the richer course, faculty, and resource fields used by
the public website and clears CMS content records before the replacement seed
is loaded.

This migration does not remove Supabase Auth users, so existing admin login
accounts remain available. It does remove existing content records, including
registrations and uploaded media metadata; run it only when the replacement
content is ready to seed.

## 4. Verify the storage bucket

After running the SQL:
- Dashboard → **Storage** → you should see a `media` bucket (public)

## 5. Photo upload

`PhotoUpload.tsx` now uploads to the `media` bucket under `teachers/<timestamp>-<random>.<ext>` and stores the public URL on the record.

To test:
1. Start the dev server: `npm run dev`
2. Go to `/admin/teachers/t1`
3. Click **Upload Photo** → pick an image
4. The image uploads to Supabase Storage and the preview shows the public URL

## 6. Next steps

- **Admin auth** — write policies require the `authenticated` role. The admin
  app already provides email/password Supabase Auth and protects admin routes;
  use an authenticated admin session for content writes.
- **Data layer swap** — `src/lib/data.ts` currently returns mock data. Next step is to replace each getter with a Supabase query so the admin reads live data.
