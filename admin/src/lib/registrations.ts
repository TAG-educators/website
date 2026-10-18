// ============================================================
// TAG Admin — Registrations data access (Supabase)
// All reads/writes for the `registrations` table go through here.
// Maps between DB snake_case and TS camelCase.
// ============================================================

import { supabase } from "./supabase";
import type { Registration } from "./types";

// ---------- DB row shape (snake_case from Supabase) ----------
interface RegistrationRow {
  id: string;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  location: string;
  parent_phone: string;
  courses: string[];
  created_at: string;
  status: string;
}

// ---------- Mappers ----------
function rowToRegistration(row: RegistrationRow): Registration {
  return {
    id: row.id,
    studentName: row.student_name,
    parentName: row.parent_name,
    email: row.email,
    phone: row.phone,
    location: row.location ?? "",
    parentPhone: row.parent_phone ?? "",
    courses: row.courses ?? [],
    createdAt: row.created_at,
    status: row.status as Registration["status"],
  };
}

function registrationToRow(r: Partial<Registration>): Partial<RegistrationRow> {
  const row: Partial<RegistrationRow> = {};
  if (r.studentName !== undefined) row.student_name = r.studentName;
  if (r.parentName !== undefined) row.parent_name = r.parentName;
  if (r.email !== undefined) row.email = r.email;
  if (r.phone !== undefined) row.phone = r.phone;
  if (r.location !== undefined) row.location = r.location;
  if (r.parentPhone !== undefined) row.parent_phone = r.parentPhone;
  if (r.courses !== undefined) row.courses = r.courses;
  if (r.status !== undefined) row.status = r.status;
  return row;
}

// ---------- API ----------
export async function fetchRegistrations(): Promise<{
  data: Registration[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data as RegistrationRow[]).map(rowToRegistration), error: null };
}

export async function fetchRegistrationById(
  id: string,
): Promise<{ data: Registration | null; error: string | null }> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToRegistration(data as RegistrationRow), error: null };
}

export async function createRegistration(
  r: Omit<Registration, "id" | "createdAt">,
): Promise<{ data: Registration | null; error: string | null }> {
  const row = registrationToRow(r);
  const { data, error } = await supabase
    .from("registrations")
    .insert(row)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToRegistration(data as RegistrationRow), error: null };
}

export async function updateRegistration(
  id: string,
  patch: Partial<Registration>,
): Promise<{ data: Registration | null; error: string | null }> {
  const row = registrationToRow(patch);
  const { data, error } = await supabase
    .from("registrations")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToRegistration(data as RegistrationRow), error: null };
}

export async function deleteRegistration(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("registrations").delete().eq("id", id);
  return { error: error ? error.message : null };
}
