"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Star } from "lucide-react";
import { fetchTeacherById, createTeacher, updateTeacher, deleteTeacher } from "@/lib/teachers";
import type { Teacher, Level } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { PhotoUpload } from "@/components/ui/PhotoUpload";

const LEVELS: Level[] = ["O Level", "A Level", "AS Level", "A2 Level", "IGCSE"];

function blankTeacher(): Teacher {
  return {
    id: "",
    name: "",
    slug: "",
    photo: null,
    role: "",
    description: "",
    qualifications: [],
    subjects: [],
    levels: [],
    yearsExperience: 0,
    cambridgeCertified: false,
    imageQuery: "",
    experience: "",
    expertise: [],
    badges: [],
    stats: [],
    featured: false,
    updatedAt: new Date().toISOString(),
  };
}

export default function TeacherEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [teacher, setTeacher] = useState<Teacher>(blankTeacher());
  const [subjectsInput, setSubjectsInput] = useState("");
  const [levelsInput, setLevelsInput] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing teacher
  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    fetchTeacherById(id).then(({ data, error }) => {
      if (error || !data) {
        setNotFound(true);
      } else {
        setTeacher(data);
        setSubjectsInput(data.subjects.join(", "));
        setLevelsInput(data.levels.join(", "));
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof Teacher>(key: K, value: Teacher[K]) {
    setTeacher((t) => ({ ...t, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      name: teacher.name,
      slug: teacher.slug,
      photo: teacher.photo,
      role: teacher.role,
      description: teacher.description,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,
      levels: teacher.levels,
      yearsExperience: teacher.yearsExperience,
      cambridgeCertified: teacher.cambridgeCertified,
      imageQuery: teacher.imageQuery,
      experience: teacher.experience,
      expertise: teacher.expertise,
      badges: teacher.badges,
      stats: teacher.stats,
      featured: teacher.featured,
    };

    if (isNew) {
      const { data, error } = await createTeacher(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      // Redirect to the new id-based URL
      if (data) router.replace(`/admin/teachers/${data.id}`);
    } else {
      const { error } = await updateTeacher(id, payload);
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
    if (!confirm(`Delete ${teacher.name}? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deleteTeacher(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/teachers");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">Loading faculty…</div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Faculty member not found.</p>
        <Link href="/admin/teachers" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Faculty
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/teachers"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Faculty
      </Link>

      <PageHeader
        title={isNew ? "New Faculty Member" : teacher.name || "Untitled Faculty"}
        description={isNew ? "Add a new faculty profile." : `Editing · ${teacher.slug}`}
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
          <CardHeader title="Profile" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <Input value={teacher.name} onChange={(e) => update("name", e.target.value)} placeholder="Dr. Sana Mahmood" />
            </Field>
            <Field label="Slug">
              <Input value={teacher.slug} onChange={(e) => update("slug", e.target.value)} placeholder="sana-mahmood" />
            </Field>
            <Field label="Role">
              <Input value={teacher.role} onChange={(e) => update("role", e.target.value)} placeholder="Senior Physics Tutor" />
            </Field>
            <Field label="Image query">
              <Input value={teacher.imageQuery} onChange={(e) => update("imageQuery", e.target.value)} placeholder="professional physics teacher" />
            </Field>
            <Field label="Years of Experience">
              <Input
                type="number"
                value={teacher.yearsExperience}
                onChange={(e) => update("yearsExperience", Number(e.target.value))}
                placeholder="12"
              />
            </Field>
          </div>
          <PhotoUpload
            value={teacher.photo}
            onChange={(url) => update("photo", url)}
            label="Photo"
            hint="Click the box or drag an image. JPG/PNG up to 5MB."
          />
        </Card>

        <Card>
          <CardHeader title="Description" />
          <div className="p-4">
            <Field
              label="Bio / Description"
              hint="A long-form profile shown on the teacher's public page. Supports plain text."
            >
              <Textarea
                value={teacher.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="e.g. PhD in Physics with 12 years of coaching Cambridge and Edexcel students. Specializes in O & A Level Physics and Mathematics, with a track record of producing A* results through small, focused batches and past-paper drilling."
                className="min-h-[160px]"
              />
            </Field>
            <Field label="Experience summary">
              <Textarea value={teacher.experience} onChange={(e) => update("experience", e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Subjects & Levels" />
          <div className="p-4 grid gap-4">
            <Field label="Subjects (comma-separated)" hint="e.g. Physics, Mathematics">
              <Input
                value={subjectsInput}
                onChange={(e) => {
                  setSubjectsInput(e.target.value);
                  update("subjects", e.target.value.split(",").map((s) => s.trim()).filter(Boolean));
                }}
                placeholder="Physics, Mathematics"
              />
            </Field>
            <Field label="Levels (comma-separated)" hint="e.g. O Level, A Level">
              <Input
                value={levelsInput}
                onChange={(e) => {
                  setLevelsInput(e.target.value);
                  update("levels", e.target.value.split(",").map((s) => s.trim() as Level).filter(Boolean));
                }}
                placeholder="O Level, A Level"
              />
            </Field>
            <Field label="Qualifications (comma-separated)">
              <Input value={teacher.qualifications.join(", ")} onChange={(e) => update("qualifications", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="PhD in Physics, Cambridge Certified" />
            </Field>
            <Field label="Expertise (comma-separated)">
              <Input value={teacher.expertise.join(", ")} onChange={(e) => update("expertise", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Mechanics, Past papers" />
            </Field>
            <Field label="Badges (comma-separated)">
              <Input value={teacher.badges.join(", ")} onChange={(e) => update("badges", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Top Rated, Cambridge Expert" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Visibility" />
          <div className="p-4 grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-ink-faint" />
                <span className="text-sm text-ink-soft">Featured faculty</span>
              </div>
              <Toggle checked={teacher.featured} onChange={(v) => update("featured", v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">Cambridge certified</span>
              <Toggle checked={teacher.cambridgeCertified} onChange={(v) => update("cambridgeCertified", v)} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
