"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import {
  fetchBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import type { Status } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Field } from "@/components/ui/Input";

const CATEGORIES = [
  "Study Tips",
  "Exam Prep",
  "Student Success",
  "Announcements",
  "Resources",
  "General",
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function blankPost(): BlogPost {
  return {
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: null,
    author: "",
    category: "General",
    tags: [],
    status: "draft",
    publishedAt: null,
    createdAt: "",
    updatedAt: "",
  };
}

export default function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [post, setPost] = useState<BlogPost>(blankPost());
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchBlogPostById(id).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else {
        setPost(data);
        setTagsInput(data.tags.join(", "));
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const slug = post.slug || slugify(post.title);

    const payload = {
      title: post.title,
      slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      category: post.category,
      tags,
      status: post.status,
      publishedAt:
        post.status === "published" && !post.publishedAt
          ? new Date().toISOString()
          : post.publishedAt,
    };

    if (isNew) {
      const { data, error } = await createBlogPost(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/blog/${data.id}`);
    } else {
      const { error } = await updateBlogPost(id, payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 1800);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeleting(true);
    const { error } = await deleteBlogPost(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/blog");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">
        Loading blog post…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Blog post not found.</p>
        <Link href="/admin/blog" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Blog
      </Link>

      <PageHeader
        title={isNew ? "New Blog Post" : post.title || "Untitled Post"}
        description={isNew ? "Compose a new blog article." : `Editing · ${post.category}`}
        action={
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-danger"
              onClick={handleDelete}
              disabled={deleting || isNew}
            >
              <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete"}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        <Card>
          <CardHeader title="Post Details" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Title">
                <Input
                  value={post.title}
                  onChange={(e) => {
                    update("title", e.target.value);
                    if (isNew) update("slug", slugify(e.target.value));
                  }}
                  placeholder="Top 10 Study Tips for A-Level Physics"
                />
              </Field>
            </div>
            <Field label="Slug" hint="URL-friendly identifier">
              <Input
                value={post.slug}
                onChange={(e) => update("slug", slugify(e.target.value))}
                placeholder="top-10-study-tips-a-level-physics"
              />
            </Field>
            <Field label="Author">
              <Input
                value={post.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="TAG Educators"
              />
            </Field>
            <Field label="Category">
              <Select
                value={post.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={post.status}
                onChange={(e) => update("status", e.target.value as Status)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Tags" hint="Comma-separated">
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="physics, a-level, study-tips"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Cover Image URL" hint="Optional — paste an image URL">
                <Input
                  value={post.coverImage ?? ""}
                  onChange={(e) => update("coverImage", e.target.value || null)}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Excerpt" />
          <div className="p-4">
            <Field label="Excerpt" hint="Short summary shown in blog listings">
              <Textarea
                value={post.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="A quick guide to acing your A-Level Physics exams…"
                className="min-h-[80px]"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Content" />
          <div className="p-4">
            <Field label="Content" hint="HTML content of the blog post">
              <Textarea
                value={post.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder="<p>Write your article here…</p>"
                className="min-h-[400px] font-mono text-[13px]"
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}
