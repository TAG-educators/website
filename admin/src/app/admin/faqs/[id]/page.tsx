"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import {
  fetchFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "@/lib/faqs";
import type { Faq } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Field } from "@/components/ui/Input";

const CATEGORIES = ["Classes", "Registration", "Pricing", "Teachers", "General"];

function blankFaq(): Faq {
  return {
    id: "",
    question: "",
    answer: "",
    category: "General",
    sortOrder: 0,
  };
}

export default function FaqEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [faq, setFaq] = useState<Faq>(blankFaq());
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
    fetchFaqById(id).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setFaq(data);
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof Faq>(key: K, value: Faq[K]) {
    setFaq((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const payload = {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sortOrder: faq.sortOrder,
    };
    if (isNew) {
      const { data, error } = await createFaq(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/faqs/${data.id}`);
    } else {
      const { error } = await updateFaq(id, payload);
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
    if (!confirm(`Delete this FAQ? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deleteFaq(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/faqs");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">
        Loading FAQ…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">FAQ not found.</p>
        <Link href="/admin/faqs" className="mt-3 inline-block text-accent hover:underline">
          ← Back to FAQs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/faqs"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> FAQs
      </Link>

      <PageHeader
        title={isNew ? "New FAQ" : faq.question || "Untitled FAQ"}
        description={isNew ? "Add a new frequently asked question." : `Editing · ${faq.category}`}
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
          <CardHeader title="Question" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order" hint="Lower numbers appear first">
              <Input
                type="number"
                value={faq.sortOrder}
                onChange={(e) => update("sortOrder", Number(e.target.value))}
                placeholder="1"
              />
            </Field>
            <Field label="Category">
              <Select value={faq.category} onChange={(e) => update("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Question">
                <Input value={faq.question} onChange={(e) => update("question", e.target.value)} placeholder="How big are the batches?" />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Answer" />
          <div className="p-4">
            <Field label="Answer">
              <Textarea
                value={faq.answer}
                onChange={(e) => update("answer", e.target.value)}
                placeholder="We keep batches between 8 and 15 students."
                className="min-h-[120px]"
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}
