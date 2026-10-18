// ============================================================
// TAG Admin — Teachers data access (Supabase)
// All reads/writes for the `teachers` table go through here.
// Maps between DB snake_case and TS camelCase.
// ============================================================

import { supabase } from "./supabase";
import type { Teacher, Level } from "./types";

// ---------- DB row shape (snake_case from Supabase) ----------
interface TeacherRow {
  id: string;
  name: string;
  slug: string;
  photo: string | null;
  role: string;
  description: string;
  qualifications: string[];
  subjects: string[];
  levels: string[];
  years_experience: number;
  cambridge_certified: boolean;
  image_query: string;
  experience: string;
  expertise: string[];
  badges: string[];
  stats: { num: string; label: string }[];
  featured: boolean;
  updated_at: string;
}

// ---------- Mappers ----------
function rowToTeacher(row: TeacherRow): Teacher {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    photo: row.photo,
    role: row.role ?? "",
    description: row.description,
    qualifications: row.qualifications ?? [],
    subjects: row.subjects ?? [],
    levels: (row.levels ?? []) as Level[],
    yearsExperience: row.years_experience,
    cambridgeCertified: row.cambridge_certified ?? false,
    imageQuery: row.image_query ?? "",
    experience: row.experience ?? "",
    expertise: row.expertise ?? [],
    badges: row.badges ?? [],
    stats: row.stats ?? [],
    featured: row.featured,
    updatedAt: row.updated_at,
  };
}

function teacherToRow(t: Partial<Teacher>): Partial<TeacherRow> {
  const row: Partial<TeacherRow> = {};
  if (t.name !== undefined) row.name = t.name;
  if (t.slug !== undefined) row.slug = t.slug;
  if (t.photo !== undefined) row.photo = t.photo;
  if (t.role !== undefined) row.role = t.role;
  if (t.description !== undefined) row.description = t.description;
  if (t.qualifications !== undefined) row.qualifications = t.qualifications;
  if (t.subjects !== undefined) row.subjects = t.subjects;
  if (t.levels !== undefined) row.levels = t.levels;
  if (t.yearsExperience !== undefined) row.years_experience = t.yearsExperience;
  if (t.cambridgeCertified !== undefined) row.cambridge_certified = t.cambridgeCertified;
  if (t.imageQuery !== undefined) row.image_query = t.imageQuery;
  if (t.experience !== undefined) row.experience = t.experience;
  if (t.expertise !== undefined) row.expertise = t.expertise;
  if (t.badges !== undefined) row.badges = t.badges;
  if (t.stats !== undefined) row.stats = t.stats;
  if (t.featured !== undefined) row.featured = t.featured;
  return row;
}

// ---------- API ----------
export async function fetchTeachers(): Promise<{ data: Teacher[]; error: string | null }> {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("name", { ascending: true });
  if (error) return { data: [], error: error.message };
  return { data: (data as TeacherRow[]).map(rowToTeacher), error: null };
}

export async function fetchTeacherById(
  id: string,
): Promise<{ data: Teacher | null; error: string | null }> {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToTeacher(data as TeacherRow), error: null };
}

export async function fetchTeacherBySlug(
  slug: string,
): Promise<{ data: Teacher | null; error: string | null }> {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToTeacher(data as TeacherRow), error: null };
}

export async function createTeacher(
  t: Omit<Teacher, "id" | "updatedAt">,
): Promise<{ data: Teacher | null; error: string | null }> {
  const row = teacherToRow(t);
  const { data, error } = await supabase
    .from("teachers")
    .insert(row)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToTeacher(data as TeacherRow), error: null };
}

export async function updateTeacher(
  id: string,
  patch: Partial<Teacher>,
): Promise<{ data: Teacher | null; error: string | null }> {
  const row = teacherToRow(patch);
  const { data, error } = await supabase
    .from("teachers")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToTeacher(data as TeacherRow), error: null };
}

export async function deleteTeacher(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  return { error: error ? error.message : null };
}
