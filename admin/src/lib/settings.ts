import { supabase } from "./supabase";

/** Site-wide settings (single row in site_settings table, id = 1). */
export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  youtube: string;
  domain: string;
  metaDescription: string;
  font: string;
}

interface SiteSettingsRow {
  site_name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  youtube: string;
  domain: string;
  meta_description: string;
  font: string;
}

const TABLE = "site_settings";

function rowToSettings(r: SiteSettingsRow): SiteSettings {
  return {
    siteName: r.site_name,
    tagline: r.tagline,
    description: r.description,
    email: r.email,
    phone: r.phone,
    address: r.address,
    instagram: r.instagram,
    facebook: r.facebook,
    youtube: r.youtube,
    domain: r.domain,
    metaDescription: r.meta_description,
    font: r.font ?? "Inter",
  };
}

function settingsToRow(s: SiteSettings): SiteSettingsRow {
  return {
    site_name: s.siteName,
    tagline: s.tagline,
    description: s.description,
    email: s.email,
    phone: s.phone,
    address: s.address,
    instagram: s.instagram,
    facebook: s.facebook,
    youtube: s.youtube,
    domain: s.domain,
    meta_description: s.metaDescription,
    font: s.font,
  };
}

export async function fetchSettings(): Promise<{
  data: SiteSettings | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToSettings(data as SiteSettingsRow), error: null };
}

export async function updateSettings(
  payload: SiteSettings,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...settingsToRow(payload), updated_at: new Date().toISOString() })
    .eq("id", 1);
  return { error: error?.message ?? null };
}
