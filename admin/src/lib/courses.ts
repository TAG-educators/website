// ============================================================
// TAG Admin â€” Courses data access (Supabase)
// All reads/writes for the `courses` table go through here.
// Maps between DB snake_case and TS camelCase.
// ============================================================

import { supabase } from "./supabase";
import type { Course, Level, Status } from "./types";

// ---------- DB row shape (snake_case from Supabase) ----------
interface CourseRow {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  levels: string[];
  level: string;
  subject: string;
  icon: string;
  image_query: string;
  category: string;
  topics: string[];
  what_you_will_learn: string[];
  benefits: string[];
  teacher_ids: string[];
  price: number;
  original_price: number;
  currency: string;
  status: string;
  featured: boolean;
  start_date: string | null;
  batch_size: number;
  updated_at: string;
}

// ---------- Mappers ----------
function rowToCourse(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description ?? "",
    longDescription: row.long_description ?? "",
    levels: (row.levels?.length ? row.levels : [row.level]) as Level[],
    level: row.level as Level,
    subject: row.subject,
    icon: row.icon ?? "BookOpen",
    imageQuery: row.image_query ?? "",
    category: row.category ?? "Sciences",
    topics: row.topics ?? [],
    whatYouWillLearn: row.what_you_will_learn ?? [],
    benefits: row.benefits ?? [],
    teacherIds: row.teacher_ids ?? [],
    price: Number(row.price),
    originalPrice: Number(row.original_price ?? row.price),
    currency: row.currency,
    status: row.status as Status,
    featured: row.featured,
    startDate: row.start_date,
    batchSize: row.batch_size,
    updatedAt: row.updated_at,
  };
}

function courseToRow(c: Partial<Course>): Partial<CourseRow> {
  const row: Partial<CourseRow> = {};
  if (c.title !== undefined) row.title = c.title;
  if (c.slug !== undefined) row.slug = c.slug;
  if (c.shortDescription !== undefined) row.short_description = c.shortDescription;
  if (c.longDescription !== undefined) row.long_description = c.longDescription;
  if (c.levels !== undefined) row.levels = c.levels;
  if (c.level !== undefined) row.level = c.level;
  if (c.subject !== undefined) row.subject = c.subject;
  if (c.icon !== undefined) row.icon = c.icon;
  if (c.imageQuery !== undefined) row.image_query = c.imageQuery;
  if (c.category !== undefined) row.category = c.category;
  if (c.topics !== undefined) row.topics = c.topics;
  if (c.whatYouWillLearn !== undefined) row.what_you_will_learn = c.whatYouWillLearn;
  if (c.benefits !== undefined) row.benefits = c.benefits;
  if (c.teacherIds !== undefined) row.teacher_ids = c.teacherIds;
  if (c.price !== undefined) row.price = c.price;
  if (c.originalPrice !== undefined) row.original_price = c.originalPrice;
  if (c.currency !== undefined) row.currency = c.currency;
  if (c.status !== undefined) row.status = c.status;
  if (c.featured !== undefined) row.featured = c.featured;
  if (c.startDate !== undefined) row.start_date = c.startDate;
  if (c.batchSize !== undefined) row.batch_size = c.batchSize;
  return row;
}

// ---------- API ----------
export async function fetchCourses(): Promise<{ data: Course[]; error: string | null }> {
  // Use a fresh fetch to avoid stale cached results
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/courses?select=*&order=title`, {
      headers: {
        apikey: anonKey,
        Authorization: "Bearer " + anonKey,
      },
      cache: "no-store",
    });
    if (!res.ok) return { data: [], error: `HTTP ${res.status}` };
    const rows = (await res.json()) as CourseRow[];
    return { data: rows.map(rowToCourse), error: null };
  } catch (e) {
    return { data: [], error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function fetchCourseById(
  id: string,
): Promise<{ data: Course | null; error: string | null }> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToCourse(data as CourseRow), error: null };
}

export async function fetchCourseBySlug(
  slug: string,
): Promise<{ data: Course | null; error: string | null }> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToCourse(data as CourseRow), error: null };
}

export async function createCourse(
  c: Omit<Course, "id" | "updatedAt">,
): Promise<{ data: Course | null; error: string | null }> {
  const row = courseToRow(c);
  const { data, error } = await supabase
    .from("courses")
    .insert(row)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToCourse(data as CourseRow), error: null };
}

export async function updateCourse(
  id: string,
  patch: Partial<Course>,
): Promise<{ data: Course | null; error: string | null }> {
  const row = courseToRow(patch);
  const { data, error } = await supabase
    .from("courses")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToCourse(data as CourseRow), error: null };
}

export async function deleteCourse(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  return { error: error ? error.message : null };
}
