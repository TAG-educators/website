// ============================================================
// TAG Admin — Testimonials data access (Supabase)
// ============================================================

import { supabase } from "./supabase";
import type { Testimonial } from "./types";

interface TestimonialRow {
  id: string;
  student_name: string;
  course: string;
  result: string;
  quote: string;
  featured: boolean;
  video_url: string | null;
  poster: string | null;
}

function rowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    studentName: row.student_name,
    course: row.course,
    result: row.result,
    quote: row.quote,
    featured: row.featured,
    videoUrl: row.video_url,
    poster: row.poster,
  };
}

function testimonialToRow(t: Partial<Testimonial>): Partial<TestimonialRow> {
  const row: Partial<TestimonialRow> = {};
  if (t.studentName !== undefined) row.student_name = t.studentName;
  if (t.course !== undefined) row.course = t.course;
  if (t.result !== undefined) row.result = t.result;
  if (t.quote !== undefined) row.quote = t.quote;
  if (t.featured !== undefined) row.featured = t.featured;
  if (t.videoUrl !== undefined) row.video_url = t.videoUrl;
  if (t.poster !== undefined) row.poster = t.poster;
  return row;
}

export async function fetchTestimonials(): Promise<{
  data: Testimonial[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("student_name", { ascending: true });
  if (error) return { data: [], error: error.message };
  return { data: (data as TestimonialRow[]).map(rowToTestimonial), error: null };
}

export async function fetchTestimonialById(
  id: string,
): Promise<{ data: Testimonial | null; error: string | null }> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToTestimonial(data as TestimonialRow), error: null };
}

export async function createTestimonial(
  t: Omit<Testimonial, "id">,
): Promise<{ data: Testimonial | null; error: string | null }> {
  const row = testimonialToRow(t);
  const { data, error } = await supabase
    .from("testimonials")
    .insert(row)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToTestimonial(data as TestimonialRow), error: null };
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Testimonial>,
): Promise<{ data: Testimonial | null; error: string | null }> {
  const row = testimonialToRow(patch);
  const { data, error } = await supabase
    .from("testimonials")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToTestimonial(data as TestimonialRow), error: null };
}

export async function deleteTestimonial(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  return { error: error ? error.message : null };
}
