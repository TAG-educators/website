// ============================================================
// TAG Admin — Resources data access (Supabase)
// All reads/writes for the `resources` table go through here.
// Maps between DB snake_case and TS camelCase.
// ============================================================

import { supabase } from "./supabase";
import type { Resource, Level } from "./types";

// ---------- DB row shape (snake_case from Supabase) ----------
interface ResourceRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: string;
  subject: string;
  level: string;
  topic: string;
  published_date: string | null;
  read_time: string;
  icon: string;
  url: string | null;
  featured: boolean;
  updated_at: string;
}

// ---------- Mappers ----------
function rowToResource(row: ResourceRow): Resource {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    type: row.type as Resource["type"],
    subject: row.subject,
    level: row.level as Level,
    topic: row.topic ?? "",
    date: row.published_date ?? "",
    readTime: row.read_time ?? "",
    icon: row.icon ?? "FileText",
    url: row.url,
    featured: row.featured,
    updatedAt: row.updated_at,
  };
}

function resourceToRow(r: Partial<Resource>): Partial<ResourceRow> {
  const row: Partial<ResourceRow> = {};
  if (r.title !== undefined) row.title = r.title;
  if (r.slug !== undefined) row.slug = r.slug;
  if (r.excerpt !== undefined) row.excerpt = r.excerpt;
  if (r.type !== undefined) row.type = r.type;
  if (r.subject !== undefined) row.subject = r.subject;
  if (r.level !== undefined) row.level = r.level;
  // topic column may not exist yet in the live DB — include it but
  // the caller should handle errors gracefully.
  if (r.topic !== undefined) row.topic = r.topic;
  if (r.date !== undefined) row.published_date = r.date || null;
  if (r.readTime !== undefined) row.read_time = r.readTime;
  if (r.icon !== undefined) row.icon = r.icon;
  if (r.url !== undefined) row.url = r.url;
  if (r.featured !== undefined) row.featured = r.featured;
  return row;
}

// ---------- API ----------
export async function fetchResources(): Promise<{ data: Resource[]; error: string | null }> {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("title", { ascending: true });
  if (error) return { data: [], error: error.message };
  return { data: (data as ResourceRow[]).map(rowToResource), error: null };
}

export async function fetchResourceById(
  id: string,
): Promise<{ data: Resource | null; error: string | null }> {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToResource(data as ResourceRow), error: null };
}

export async function createResource(
  r: Omit<Resource, "id" | "updatedAt">,
): Promise<{ data: Resource | null; error: string | null }> {
  const row = resourceToRow(r);
  const { data, error } = await supabase
    .from("resources")
    .insert(row)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToResource(data as ResourceRow), error: null };
}

export async function updateResource(
  id: string,
  patch: Partial<Resource>,
): Promise<{ data: Resource | null; error: string | null }> {
  const row = resourceToRow(patch);
  const { data, error } = await supabase
    .from("resources")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToResource(data as ResourceRow), error: null };
}

export async function deleteResource(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("resources").delete().eq("id", id);
  return { error: error ? error.message : null };
}
