// ============================================================
// TAG Admin — Blog posts data access (Supabase)
// ============================================================

import { supabase } from "./supabase";
import type { Status } from "./types";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  category: string;
  tags: string[];
  status: Status;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author: string;
  category: string;
  tags: string[];
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToPost(row: BlogRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    author: row.author,
    category: row.category,
    tags: row.tags ?? [],
    status: row.status as Status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchBlogPosts(): Promise<{ data: BlogPost[]; error: string | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data as BlogRow[]).map(rowToPost), error: null };
}

export async function fetchPublishedBlogPosts(): Promise<{ data: BlogPost[]; error: string | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data as BlogRow[]).map(rowToPost), error: null };
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<{ data: BlogPost | null; error: string | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToPost(data as BlogRow), error: null };
}

export async function fetchBlogPostById(
  id: string,
): Promise<{ data: BlogPost | null; error: string | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToPost(data as BlogRow), error: null };
}

export async function createBlogPost(
  p: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
): Promise<{ data: BlogPost | null; error: string | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      cover_image: p.coverImage,
      author: p.author,
      category: p.category,
      tags: p.tags,
      status: p.status,
      published_at: p.publishedAt,
    })
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToPost(data as BlogRow), error: null };
}

export async function updateBlogPost(
  id: string,
  patch: Partial<BlogPost>,
): Promise<{ data: BlogPost | null; error: string | null }> {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.slug !== undefined) row.slug = patch.slug;
  if (patch.excerpt !== undefined) row.excerpt = patch.excerpt;
  if (patch.content !== undefined) row.content = patch.content;
  if (patch.coverImage !== undefined) row.cover_image = patch.coverImage;
  if (patch.author !== undefined) row.author = patch.author;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.tags !== undefined) row.tags = patch.tags;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.publishedAt !== undefined) row.published_at = patch.publishedAt;

  const { data, error } = await supabase
    .from("blog_posts")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToPost(data as BlogRow), error: null };
}

export async function deleteBlogPost(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  return { error: error ? error.message : null };
}
