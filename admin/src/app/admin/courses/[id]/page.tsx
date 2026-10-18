"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Star, X } from "lucide-react";
import { fetchCourseById, createCourse, updateCourse, deleteCourse } from "@/lib/courses";
import { fetchTeachers } from "@/lib/teachers";
import type { Course, Level, Status, Teacher } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Field } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

const LEVELS: Level[] = ["O Level", "A Level", "AS Level", "A2 Level", "IGCSE"];
const STATUSES: Status[] = ["draft", "published", "archived"];

function blankCourse(): Course {
  return {
    id: "",
    title: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    levels: ["O Level"],
    level: "O Level",
    subject: "",
    icon: "BookOpen",
    imageQuery: "",
    category: "Sciences",
    topics: [],
    whatYouWillLearn: [],
    benefits: [],
    teacherIds: [],
    price: 0,
    originalPrice: 0,
    currency: "PKR",
    status: "published",
    featured: false,
    startDate: null,
    batchSize: 12,
    updatedAt: new Date().toISOString(),
  };
}

export default function CourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [course, setCourse] = useState<Course>(blankCourse());
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load course + teachers list (for the teacher picker)
  useEffect(() => {
    const loadTeachers = fetchTeachers().then(({ data }) => setTeachers(data));

    if (isNew) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchCourseById(id).then(({ data, error }) => {
      if (error || !data) {
        setNotFound(true);
      } else {
        setCourse(data);
      }
      setLoading(false);
    });

    loadTeachers;
  }, [id, isNew]);

  function update<K extends keyof Course>(key: K, value: Course[K]) {
    setCourse((c) => ({ ...c, [key]: value }));
  }

  function toggleTeacher(teacherId: string) {
    setCourse((c) => ({
      ...c,
      teacherIds: c.teacherIds.includes(teacherId)
        ? c.teacherIds.filter((t) => t !== teacherId)
        : [...c.teacherIds, teacherId],
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      title: course.title,
      slug: course.slug,
      shortDescription: course.shortDescription,
      longDescription: course.longDescription,
      levels: course.levels,
      level: course.level,
      subject: course.subject,
      icon: course.icon,
      imageQuery: course.imageQuery,
      category: course.category,
      topics: course.topics,
      whatYouWillLearn: course.whatYouWillLearn,
      benefits: course.benefits,
      teacherIds: course.teacherIds,
      price: course.price,
      originalPrice: course.originalPrice,
      currency: course.currency,
      status: course.status,
      featured: course.featured,
      startDate: course.startDate,
      batchSize: course.batchSize,
    };

    if (isNew) {
      const { data, error } = await createCourse(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/courses/${data.id}`);
    } else {
      const { error } = await updateCourse(id, payload);
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
    if (!confirm(`Delete ${course.title}? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deleteCourse(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/courses");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">Loading course…</div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Course not found.</p>
        <Link href="/admin/courses" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Courses
      </Link>

      <PageHeader
        title={isNew ? "New Course" : course.title || "Untitled Course"}
        description={isNew ? "Create a new course in the catalog." : `Editing · ${course.slug}`}
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
          <CardHeader title="Course Details" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <Input value={course.title} onChange={(e) => update("title", e.target.value)} placeholder="Physics O Level" />
            </Field>
            <Field label="Slug">
              <Input value={course.slug} onChange={(e) => update("slug", e.target.value)} placeholder="physics-o-level" />
            </Field>
            <Field label="Subject">
              <Input value={course.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Physics" />
            </Field>
            <Field label="Category">
              <Input value={course.category} onChange={(e) => update("category", e.target.value)} placeholder="Sciences" />
            </Field>
            <Field label="Icon name">
              <Input value={course.icon} onChange={(e) => update("icon", e.target.value)} placeholder="Atom" />
            </Field>
            <Field label="Level">
              <Select value={course.level} onChange={(e) => update("level", e.target.value as Level)}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </Field>
            <Field label="Price (PKR)" hint="Discounted price shown to students.">
              <Input
                type="number"
                value={course.price === 0 ? "" : course.price}
                onChange={(e) => update("price", e.target.value === "" ? 0 : Number(e.target.value))}
                placeholder="21000"
              />
            </Field>
            <Field label="Original Price (PKR)" hint="Strike-through value shown before the discounted price.">
              <Input
                type="number"
                value={course.originalPrice === 0 ? "" : course.originalPrice}
                onChange={(e) => update("originalPrice", e.target.value === "" ? 0 : Number(e.target.value))}
                placeholder="35000"
              />
            </Field>
            <Field label="Batch Size">
              <Input
                type="number"
                value={course.batchSize}
                onChange={(e) => update("batchSize", Number(e.target.value))}
                placeholder="12"
              />
            </Field>
            <Field label="Start Date">
              <Input
                type="date"
                value={course.startDate ?? ""}
                onChange={(e) => update("startDate", e.target.value || null)}
              />
            </Field>
            <Field label="Status">
              <Select value={course.status} onChange={(e) => update("status", e.target.value as Status)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Levels" hint="Click + to add a level">
              <div className="flex flex-wrap items-center gap-1.5 rounded-[6px] border border-border bg-white p-2 min-h-[38px]">
                {course.levels.map((lvl) => (
                  <span
                    key={lvl}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] bg-accent-soft text-accent-ink border border-accent-border"
                  >
                    {lvl}
                    <button
                      type="button"
                      onClick={() => update("levels", course.levels.filter((l) => l !== lvl))}
                      className="hover:text-danger"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !course.levels.includes(e.target.value as Level)) {
                      update("levels", [...course.levels, e.target.value as Level]);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="">+ Add level</option>
                  {LEVELS.filter((l) => !course.levels.includes(l)).map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Public Course Content" />
          <div className="p-4 grid gap-4">
            <Field label="Short description">
              <Textarea value={course.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
            </Field>
            <Field label="Long description">
              <Textarea value={course.longDescription} onChange={(e) => update("longDescription", e.target.value)} className="min-h-[140px]" />
            </Field>
            <Field label="Topics (comma-separated)">
              <Input value={course.topics.join(", ")} onChange={(e) => update("topics", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} />
            </Field>
            <Field label="What students will learn (comma-separated)">
              <Input value={course.whatYouWillLearn.join(", ")} onChange={(e) => update("whatYouWillLearn", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} />
            </Field>
            <Field label="Benefits (comma-separated)">
              <Input value={course.benefits.join(", ")} onChange={(e) => update("benefits", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Assigned Teachers" />
          <div className="p-4">
            {teachers.length === 0 ? (
              <p className="text-[13px] text-ink-faint">No teachers available. Add faculty first.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {teachers.map((t) => {
                  const checked = course.teacherIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-[6px] border cursor-pointer transition-colors ${
                        checked
                          ? "border-accent bg-accent-soft"
                          : "border-border hover:bg-bg-muted"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTeacher(t.id)}
                        className="accent-accent"
                      />
                      <div className="w-6 h-6 rounded-full bg-bg-muted flex items-center justify-center text-[10px] font-semibold text-ink-soft shrink-0">
                        {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="text-[13px] text-ink truncate">{t.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
            <p className="mt-3 text-[12px] text-ink-faint">
              Select which faculty members teach this course. Multiple teachers can be assigned.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Visibility" />
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-ink-faint" />
              <span className="text-sm text-ink-soft">Featured course</span>
            </div>
            <Toggle
              checked={course.featured}
              onChange={(v) => update("featured", v)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
