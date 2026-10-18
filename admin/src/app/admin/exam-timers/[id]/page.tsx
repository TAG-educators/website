"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Star } from "lucide-react";
import {
  fetchExamTimerById,
  createExamTimer,
  updateExamTimer,
  deleteExamTimer,
} from "@/lib/examTimers";
import type { ExamTimer, Level } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Field } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

const LEVELS: Level[] = ["O Level", "A Level", "AS Level", "A2 Level", "IGCSE"];
const BOARDS = ["Cambridge", "Edexcel", "AQA", "OCR"];

// Convert ISO → datetime-local input value
function toDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 16);
}

function blankExamTimer(): ExamTimer {
  return {
    id: "",
    title: "",
    board: "Cambridge",
    level: "O Level",
    subject: "",
    examDate: new Date().toISOString(),
    active: true,
    featured: false,
  };
}

export default function ExamTimerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [exam, setExam] = useState<ExamTimer>(blankExamTimer());
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
    fetchExamTimerById(id).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setExam(data);
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof ExamTimer>(key: K, value: ExamTimer[K]) {
    setExam((e) => ({ ...e, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const payload = {
      title: exam.title,
      board: exam.board,
      level: exam.level,
      subject: exam.subject,
      examDate: exam.examDate,
      active: exam.active,
      featured: exam.featured,
    };
    if (isNew) {
      const { data, error } = await createExamTimer(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/exam-timers/${data.id}`);
    } else {
      const { error } = await updateExamTimer(id, payload);
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
    if (!confirm(`Delete ${exam.title}? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deleteExamTimer(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/exam-timers");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">
        Loading exam timer…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Exam timer not found.</p>
        <Link href="/admin/exam-timers" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Exam Timers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/exam-timers"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Exam Timers
      </Link>

      <PageHeader
        title={isNew ? "New Exam Timer" : exam.title || "Untitled Exam"}
        description={isNew ? "Create a new countdown timer." : `Editing · ${exam.board} ${exam.level}`}
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
          <CardHeader title="Exam Details" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <Input value={exam.title} onChange={(e) => update("title", e.target.value)} placeholder="Physics Paper 2" />
            </Field>
            <Field label="Subject">
              <Input value={exam.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Physics" />
            </Field>
            <Field label="Board">
              <Select value={exam.board} onChange={(e) => update("board", e.target.value)}>
                {BOARDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </Select>
            </Field>
            <Field label="Level">
              <Select value={exam.level} onChange={(e) => update("level", e.target.value as Level)}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Exam Date & Time">
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(exam.examDate)}
                  onChange={(e) => update("examDate", new Date(e.target.value).toISOString())}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Visibility" />
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-ink-faint" />
                <span className="text-sm text-ink-soft">Featured timer</span>
              </div>
              <Toggle checked={exam.featured} onChange={(v) => update("featured", v)} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-ink-soft">Active (countdown visible on site)</span>
              <Toggle checked={exam.active} onChange={(v) => update("active", v)} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
