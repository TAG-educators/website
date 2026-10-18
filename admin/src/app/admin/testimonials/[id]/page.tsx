"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Star } from "lucide-react";
import {
  fetchTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/testimonials";
import type { Testimonial } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

function blankTestimonial(): Testimonial {
  return {
    id: "",
    studentName: "",
    course: "",
    result: "",
    quote: "",
    featured: false,
    videoUrl: null,
    poster: null,
  };
}

export default function TestimonialEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [testimonial, setTestimonial] = useState<Testimonial>(blankTestimonial());
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
    fetchTestimonialById(id).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setTestimonial(data);
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof Testimonial>(key: K, value: Testimonial[K]) {
    setTestimonial((t) => ({ ...t, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const payload = {
      studentName: testimonial.studentName,
      course: testimonial.course,
      result: testimonial.result,
      quote: testimonial.quote,
      featured: testimonial.featured,
      videoUrl: testimonial.videoUrl,
      poster: testimonial.poster,
    };
    if (isNew) {
      const { data, error } = await createTestimonial(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/testimonials/${data.id}`);
    } else {
      const { error } = await updateTestimonial(id, payload);
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
    if (!confirm(`Delete testimonial from ${testimonial.studentName}? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deleteTestimonial(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/testimonials");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">
        Loading testimonial…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Testimonial not found.</p>
        <Link href="/admin/testimonials" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Testimonials
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Testimonials
      </Link>

      <PageHeader
        title={isNew ? "New Testimonial" : testimonial.studentName || "Untitled Testimonial"}
        description={isNew ? "Add a new student success story." : `Editing · ${testimonial.course}`}
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
          <CardHeader title="Student" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Student Name">
              <Input value={testimonial.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="Mariam Q." />
            </Field>
            <Field label="Result">
              <Input value={testimonial.result} onChange={(e) => update("result", e.target.value)} placeholder="A*" />
            </Field>
            <Field label="Course">
              <Input value={testimonial.course} onChange={(e) => update("course", e.target.value)} placeholder="Physics O Level" />
            </Field>
            <Field label="Video URL" hint="Optional — YouTube link to a student review">
              <Input
                value={testimonial.videoUrl ?? ""}
                onChange={(e) => update("videoUrl", e.target.value || null)}
                placeholder="https://youtu.be/..."
              />
            </Field>
            <Field label="Poster Image URL" hint="Optional — image shown on the testimonial reel card">
              <Input
                value={testimonial.poster ?? ""}
                onChange={(e) => update("poster", e.target.value || null)}
                placeholder="https://images.unsplash.com/..."
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Quote" />
          <div className="p-4">
            <Field label="Quote">
              <Textarea
                value={testimonial.quote}
                onChange={(e) => update("quote", e.target.value)}
                placeholder="Small batches made all the difference..."
                className="min-h-[120px]"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Visibility" />
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-ink-faint" />
              <span className="text-sm text-ink-soft">Featured testimonial</span>
            </div>
            <Toggle checked={testimonial.featured} onChange={(v) => update("featured", v)} />
          </div>
        </Card>
      </div>
    </div>
  );
}
