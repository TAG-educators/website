import { createClient } from "@supabase/supabase-js";

/**
 * Supabase browser/client client.
 *
 * Uses the anon (publishable) key, which is safe to expose to the browser.
 * Access to data is controlled by Row Level Security (RLS) policies on each
 * table — the key alone does not grant access.
 *
 * For server-side operations that need to bypass RLS (e.g. admin writes),
 * use a service-role client created in a server-only module. Do NOT put the
 * service_role key in any NEXT_PUBLIC_ variable.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in dev if env vars are missing rather than silently breaking.
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** Name of the public storage bucket used for media uploads. */
export const MEDIA_BUCKET = "media";
