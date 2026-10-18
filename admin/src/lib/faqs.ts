// ============================================================
// TAG Admin — FAQs data access (Supabase)
// ============================================================

import { supabase } from "./supabase";
import type { Faq } from "./types";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

function rowToFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    sortOrder: row.sort_order,
  };
}

function faqToRow(f: Partial<Faq>): Partial<FaqRow> {
  const row: Partial<FaqRow> = {};
  if (f.question !== undefined) row.question = f.question;
  if (f.answer !== undefined) row.answer = f.answer;
  if (f.category !== undefined) row.category = f.category;
  if (f.sortOrder !== undefined) row.sort_order = f.sortOrder;
  return row;
}

export async function fetchFaqs(): Promise<{ data: Faq[]; error: string | null }> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return { data: [], error: error.message };
  return { data: (data as FaqRow[]).map(rowToFaq), error: null };
}

export async function fetchFaqById(
  id: string,
): Promise<{ data: Faq | null; error: string | null }> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToFaq(data as FaqRow), error: null };
}

export async function createFaq(
  f: Omit<Faq, "id">,
): Promise<{ data: Faq | null; error: string | null }> {
  const row = faqToRow(f);
  const { data, error } = await supabase
    .from("faqs")
    .insert(row)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToFaq(data as FaqRow), error: null };
}

export async function updateFaq(
  id: string,
  patch: Partial<Faq>,
): Promise<{ data: Faq | null; error: string | null }> {
  const row = faqToRow(patch);
  const { data, error } = await supabase
    .from("faqs")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToFaq(data as FaqRow), error: null };
}

export async function deleteFaq(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  return { error: error ? error.message : null };
}
