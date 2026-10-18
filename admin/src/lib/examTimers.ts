// ============================================================
// TAG Admin — Exam Timers data access (Supabase)
// ============================================================

import { supabase } from "./supabase";
import type { ExamTimer, Level } from "./types";

interface ExamTimerRow {
  id: string;
  title: string;
  board: string;
  level: string;
  subject: string;
  exam_date: string;
  active: boolean;
  featured: boolean;
}

function rowToExamTimer(row: ExamTimerRow): ExamTimer {
  return {
    id: row.id,
    title: row.title,
    board: row.board,
    level: row.level as Level,
    subject: row.subject,
    examDate: row.exam_date,
    active: row.active,
    featured: row.featured,
  };
}

function examTimerToRow(e: Partial<ExamTimer>): Partial<ExamTimerRow> {
  const row: Partial<ExamTimerRow> = {};
  if (e.title !== undefined) row.title = e.title;
  if (e.board !== undefined) row.board = e.board;
  if (e.level !== undefined) row.level = e.level;
  if (e.subject !== undefined) row.subject = e.subject;
  if (e.examDate !== undefined) row.exam_date = e.examDate;
  if (e.active !== undefined) row.active = e.active;
  if (e.featured !== undefined) row.featured = e.featured;
  return row;
}

export async function fetchExamTimers(): Promise<{
  data: ExamTimer[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("exam_timers")
    .select("*")
    .order("exam_date", { ascending: true });
  if (error) return { data: [], error: error.message };
  return { data: (data as ExamTimerRow[]).map(rowToExamTimer), error: null };
}

export async function fetchExamTimerById(
  id: string,
): Promise<{ data: ExamTimer | null; error: string | null }> {
  const { data, error } = await supabase
    .from("exam_timers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToExamTimer(data as ExamTimerRow), error: null };
}

export async function createExamTimer(
  e: Omit<ExamTimer, "id">,
): Promise<{ data: ExamTimer | null; error: string | null }> {
  const row = examTimerToRow(e);
  const { data, error } = await supabase
    .from("exam_timers")
    .insert(row)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToExamTimer(data as ExamTimerRow), error: null };
}

export async function updateExamTimer(
  id: string,
  patch: Partial<ExamTimer>,
): Promise<{ data: ExamTimer | null; error: string | null }> {
  const row = examTimerToRow(patch);
  const { data, error } = await supabase
    .from("exam_timers")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToExamTimer(data as ExamTimerRow), error: null };
}

export async function deleteExamTimer(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("exam_timers").delete().eq("id", id);
  return { error: error ? error.message : null };
}
