"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Star } from "lucide-react";
import { fetchResourceById, createResource, updateResource, deleteResource } from "@/lib/resources";
import type { Resource, Level } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Field } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { FileUpload } from "@/components/ui/FileUpload";

const LEVELS: Level[] = ["O Level", "A Level", "AS Level", "A2 Level", "IGCSE"];
const TYPES: Resource["type"][] = ["Notes", "Past Paper", "Solved Paper", "Video", "Guide", "Link"];

function blankResource(): Resource {
  return {
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    type: "Notes",
    subject: "",
    level: "O Level",
    topic: "",
    date: "",
    readTime: "",
    icon: "FileText",
    url: null,
    featured: false,
    updatedAt: new Date().toISOString(),
  };
}

export default function ResourceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [resource, setResource] = useState<Resource>(blankResource());
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchResourceById(id).then(({ data, error }) => {
      if (error || !data) {
        setNotFound(true);
      } else {
        setResource(data);
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof Resource>(key: K, value: Resource[K]) {
    setResource((r) => ({ ...r, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      title: resource.title,
      slug: resource.slug,
      excerpt: resource.excerpt,
      type: resource.type,
      subject: resource.subject,
      level: resource.level,
      topic: resource.topic,
      date: resource.date,
      readTime: resource.readTime,
      icon: resource.icon,
      url: resource.url,
      featured: resource.featured,
    };

    if (isNew) {
      const { data, error } = await createResource(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/resources/${data.id}`);
    } else {
      const { error } = await updateResource(id, payload);
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
    if (!confirm(`Delete ${resource.title}? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deleteResource(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/resources");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">Loading resource…</div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Resource not found.</p>
        <Link href="/admin/resources" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/resources"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Resources
      </Link>

      <PageHeader
        title={isNew ? "New Resource" : resource.title || "Untitled Resource"}
        description={isNew ? "Add a new downloadable resource." : `Editing · ${resource.slug}`}
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
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
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
          <CardHeader title="Resource Details" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <Input value={resource.title} onChange={(e) => update("title", e.target.value)} placeholder="Physics Motion Notes" />
            </Field>
            <Field label="Slug">
              <Input value={resource.slug} onChange={(e) => update("slug", e.target.value)} placeholder="physics-motion-notes" />
            </Field>
            <Field label="Type">
              <Select value={resource.type} onChange={(e) => update("type", e.target.value as Resource["type"])}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Subject">
              <Input value={resource.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Physics" />
            </Field>
            <Field label="Level">
              <Select value={resource.level} onChange={(e) => update("level", e.target.value as Level)}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </Field>
            <Field label="Topic">
              <Input value={resource.topic} onChange={(e) => update("topic", e.target.value)} placeholder="e.g. Mechanics & Motion" />
            </Field>
            <Field label="Published date">
              <Input type="date" value={resource.date} onChange={(e) => update("date", e.target.value)} />
            </Field>
            <Field label="Read time">
              <Input value={resource.readTime} onChange={(e) => update("readTime", e.target.value)} placeholder="8 min read" />
            </Field>
            <Field label="Icon name">
              <Input value={resource.icon} onChange={(e) => update("icon", e.target.value)} placeholder="FileText" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Public Resource Content" />
          <div className="p-4">
            <Field label="Excerpt">
              <Textarea value={resource.excerpt} onChange={(e) => update("excerpt", e.target.value)} className="min-h-[120px]" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Resource File / Link" />
          <div className="p-4">
            <FileUpload
              value={resource.url}
              onChange={(url) => update("url", url)}
              label="File or external link"
              hint="Upload a file (PDF, DOC, etc.) or paste a link (Google Drive, YouTube). Max 10MB."
              maxSizeMB={10}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Visibility" />
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-ink-faint" />
              <span className="text-sm text-ink-soft">Featured resource</span>
            </div>
            <Toggle checked={resource.featured} onChange={(v) => update("featured", v)} />
          </div>
        </Card>
      </div>
    </div>
  );
}
