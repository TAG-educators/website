import { supabase } from "./supabase";
import type { Section } from "./block-schema";

/** Full page data (used by the page builder). */
export interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  sections: Section[];
  /** Unpublished preview sections (set via "Preview", cleared on publish/discard). */
  draftSections?: Section[] | null;
  parentId?: string | null;
  sortOrder?: number;
}

/** Lightweight page row (used by the list view). */
export interface PageSummary {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  sections: number;
  updatedAt: string;
  parentId?: string | null;
  sortOrder?: number;
}

interface PageRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  sections: Section[];
  draft_sections?: Section[] | null;
  updated_at: string;
  parent_id?: string | null;
  sort_order?: number;
}

const TABLE = "pages";

type Status = "draft" | "published" | "archived";

function normalizeStatus(s: string): Status {
  return s === "published" || s === "archived" ? s : "draft";
}

function rowToSummary(r: PageRow): PageSummary {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    status: normalizeStatus(r.status),
    sections: Array.isArray(r.sections) ? r.sections.length : 0,
    updatedAt: r.updated_at,
    parentId: r.parent_id ?? null,
    sortOrder: r.sort_order ?? 0,
  };
}

function rowToPageData(r: PageRow): PageData {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    status: normalizeStatus(r.status),
    sections: Array.isArray(r.sections) ? r.sections : [],
    draftSections: Array.isArray(r.draft_sections) ? r.draft_sections : null,
    parentId: r.parent_id ?? null,
    sortOrder: r.sort_order ?? 0,
  };
}

export async function fetchPages(): Promise<{
  data: PageSummary[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: (data as PageRow[]).map(rowToSummary), error: null };
}

export async function fetchPageById(id: string): Promise<{
  data: PageData | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToPageData(data as PageRow), error: null };
}

/** Fetch a published page by its slug (used by the public site). */
export async function fetchPageBySlug(slug: string): Promise<{
  data: PageData | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToPageData(data as PageRow), error: null };
}

export async function createPage(payload: {
  title: string;
  slug: string;
  status?: Status;
  sections?: Section[];
  parentId?: string | null;
  sortOrder?: number;
}): Promise<{ data: PageData | null; error: string | null }> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: payload.title,
      slug: payload.slug,
      status: payload.status ?? "draft",
      sections: payload.sections ?? [],
      parent_id: payload.parentId ?? null,
      sort_order: payload.sortOrder ?? 0,
    })
    .select("*")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToPageData(data as PageRow), error: null };
}

export async function updatePage(
  id: string,
  payload: Partial<Pick<PageData, "title" | "slug" | "status" | "sections" | "draftSections" | "parentId" | "sortOrder">>,
): Promise<{ error: string | null }> {
  const row: Record<string, unknown> = {};
  if (payload.title !== undefined) row.title = payload.title;
  if (payload.slug !== undefined) row.slug = payload.slug;
  if (payload.status !== undefined) row.status = payload.status;
  if (payload.sections !== undefined) row.sections = payload.sections;
  if (payload.draftSections !== undefined) row.draft_sections = payload.draftSections;
  if (payload.parentId !== undefined) row.parent_id = payload.parentId;
  if (payload.sortOrder !== undefined) row.sort_order = payload.sortOrder;

  const { error } = await supabase.from(TABLE).update(row).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deletePage(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  return { error: error?.message ?? null };
}
