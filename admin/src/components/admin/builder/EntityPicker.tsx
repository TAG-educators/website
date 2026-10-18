"use client";

import { useEffect, useState } from "react";
import { Plus, X, Search, Loader2, Check, ArrowLeft } from "lucide-react";
import { fetchTeachers, createTeacher } from "@/lib/teachers";
import { fetchCourses, createCourse } from "@/lib/courses";
import { fetchTestimonials, createTestimonial } from "@/lib/testimonials";
import { fetchResources } from "@/lib/resources";
import { fetchExamTimers, createExamTimer } from "@/lib/examTimers";
import { fetchFaqs } from "@/lib/faqs";
import type { FieldDef } from "@/lib/block-schema";
import type { Level } from "@/lib/types";

// ---------- Entity descriptor ----------
// Each reference type maps to a fetch function + a way to derive a label
// (and optional photo + subtitle) from a fetched row. This keeps the picker
// generic across teachers, courses, testimonials, etc.
interface EntityRow {
  id: string;
  label: string;
  photo?: string | null;
  subtitle?: string;
}

// ---------- Inline create helpers ----------
// A single draft shape that covers all creatable entity types. Only the
// fields relevant to the current reference type are used; the rest are
// ignored. This keeps one draft state + one form component.
interface CreateDraft {
  // examTimer + course
  title: string;
  subject: string;
  // examTimer
  board: string;
  level: Level;
  examDate: string;
  // teacher
  name: string;
  subjects: string; // comma-separated
  yearsExperience: number;
  // course
  price: number;
  // testimonial
  studentName: string;
  course: string;
  result: string;
  quote: string;
}

function blankDraft(): CreateDraft {
  return {
    title: "",
    subject: "",
    board: "Cambridge",
    level: "O Level",
    examDate: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 16),
    name: "",
    subjects: "",
    yearsExperience: 0,
    price: 0,
    studentName: "",
    course: "",
    result: "",
    quote: "",
  };
}

// Convert a comma-separated string into a trimmed array, dropping empties.
function csvToArray(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

// Derive a URL-safe slug from a name or title.
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateDraft(
  reference: NonNullable<FieldDef["reference"]>,
  d: CreateDraft,
): string | null {
  switch (reference) {
    case "examTimer":
      if (!d.title.trim() || !d.subject.trim())
        return "Title and subject are required.";
      return null;
    case "teacher":
      if (!d.name.trim()) return "Name is required.";
      return null;
    case "course":
      if (!d.title.trim() || !d.subject.trim())
        return "Title and subject are required.";
      return null;
    case "testimonial":
      if (!d.studentName.trim() || !d.course.trim() || !d.quote.trim())
        return "Student name, course, and quote are required.";
      return null;
    default:
      return "This type cannot be created inline.";
  }
}

// Call the right create function for the reference type and return the new id.
async function submitCreate(
  reference: NonNullable<FieldDef["reference"]>,
  d: CreateDraft,
): Promise<{ id: string | null; error: string | null }> {
  switch (reference) {
    case "examTimer": {
      const { data, error } = await createExamTimer({
        title: d.title.trim(),
        subject: d.subject.trim(),
        board: d.board,
        level: d.level,
        examDate: new Date(d.examDate).toISOString(),
        active: true,
        featured: false,
      });
      return { id: data?.id ?? null, error };
    }
    case "teacher": {
      const { data, error } = await createTeacher({
        name: d.name.trim(),
        slug: slugify(d.name),
        photo: null,
        role: "",
        description: "",
        qualifications: [],
        subjects: csvToArray(d.subjects),
        levels: [d.level],
        yearsExperience: d.yearsExperience,
        cambridgeCertified: false,
        imageQuery: "",
        experience: "",
        expertise: [],
        badges: [],
        stats: [],
        featured: false,
      });
      return { id: data?.id ?? null, error };
    }
    case "course": {
      const { data, error } = await createCourse({
        title: d.title.trim(),
        slug: slugify(d.title),
        shortDescription: "",
        longDescription: "",
        levels: [d.level],
        level: d.level,
        subject: d.subject.trim(),
        icon: "BookOpen",
        imageQuery: "",
        category: "Sciences",
        topics: [],
        whatYouWillLearn: [],
        benefits: [],
        teacherIds: [],
        price: d.price,
        originalPrice: 0,
        currency: "PKR",
        status: "published",
        featured: false,
        startDate: null,
        batchSize: 0,
      });
      return { id: data?.id ?? null, error };
    }
    case "testimonial": {
      const { data, error } = await createTestimonial({
        studentName: d.studentName.trim(),
        course: d.course.trim(),
        result: d.result.trim(),
        quote: d.quote.trim(),
        featured: false,
        videoUrl: null,
        poster: null,
      });
      return { id: data?.id ?? null, error };
    }
    default:
      return { id: null, error: "This type cannot be created inline." };
  }
}

// Shared input className for the inline create form.
const inputCls =
  "w-full h-9 px-3 rounded-[6px] border border-border bg-white text-[13px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

// Small labeled-field wrapper used by the create form.
function CreateField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-ink mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

async function fetchEntities(reference: NonNullable<FieldDef["reference"]>): Promise<{
  data: EntityRow[];
  error: string | null;
}> {
  switch (reference) {
    case "teacher": {
      const { data, error } = await fetchTeachers();
      if (error) return { data: [], error };
      return {
        data: data.map((t) => ({
          id: t.id,
          label: t.name || t.slug,
          photo: t.photo,
          subtitle: t.subjects.join(", ") || undefined,
        })),
        error: null,
      };
    }
    case "course": {
      const { data, error } = await fetchCourses();
      if (error) return { data: [], error };
      return {
        data: data.map((c) => ({
          id: c.id,
          label: c.title,
          subtitle: [c.level, c.subject].filter(Boolean).join(" · "),
        })),
        error: null,
      };
    }
    case "testimonial": {
      const { data, error } = await fetchTestimonials();
      if (error) return { data: [], error };
      return {
        data: data.map((t) => ({
          id: t.id,
          label: t.studentName,
          subtitle: t.result || t.course || undefined,
        })),
        error: null,
      };
    }
    case "resource": {
      const { data, error } = await fetchResources();
      if (error) return { data: [], error };
      return {
        data: data.map((r) => ({
          id: r.id,
          label: r.title,
          subtitle: [r.type, r.level, r.subject].filter(Boolean).join(" · "),
        })),
        error: null,
      };
    }
    case "examTimer": {
      const { data, error } = await fetchExamTimers();
      if (error) return { data: [], error };
      return {
        data: data.map((e) => ({
          id: e.id,
          label: e.title,
          subtitle: [e.board, e.level, e.subject].filter(Boolean).join(" · "),
        })),
        error: null,
      };
    }
    case "faq": {
      const { data, error } = await fetchFaqs();
      if (error) return { data: [], error };
      return {
        data: data.map((f) => ({
          id: f.id,
          label: f.question,
          subtitle: f.category || undefined,
        })),
        error: null,
      };
    }
    default:
      return { data: [], error: `Unknown reference type: ${reference}` };
  }
}

// ---------- Entity picker (multi-select with search) ----------
export function EntityPicker({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const reference = field.reference;
  const entityLabel = reference ?? "item";
  const pluralLabel = `${entityLabel}s`;
  // Types that support inline creation from within the picker. Add more here
  // as create functions become available.
  const canCreate =
    reference === "examTimer" ||
    reference === "teacher" ||
    reference === "course" ||
    reference === "testimonial";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");

  // Inline create form state (shared across all creatable entity types).
  const [createMode, setCreateMode] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [draft, setDraft] = useState<CreateDraft>(blankDraft);

  // Human-readable label for the "New ..." button, e.g. "New teacher".
  const createButtonLabel = reference
    ? `New ${reference === "examTimer" ? "exam timer" : reference}`
    : "New";

  // Load entities when the picker opens (lazy — avoids fetching on every
  // section render, only when the user actually wants to pick).
  useEffect(() => {
    if (!open || !reference) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEntities(reference).then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error);
      setEntities(data);
      setSelectedLabels((current) => ({
        ...current,
        ...Object.fromEntries(data.map((entity) => [entity.id, entity.label])),
      }));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, reference]);

  // Resolve already-saved IDs even while the picker modal is closed. This
  // keeps persisted references readable instead of briefly showing UUIDs.
  useEffect(() => {
    if (!reference || value.length === 0) return;
    let cancelled = false;
    fetchEntities(reference).then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setError(error);
        return;
      }
      setSelectedLabels((current) => ({
        ...current,
        ...Object.fromEntries(data.map((entity) => [entity.id, entity.label])),
      }));
    });
    return () => {
      cancelled = true;
    };
  }, [reference, value]);

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  // Resolve selected IDs to labels for the chip display.
  const labelFor = (id: string): string => {
    const found = entities.find((e) => e.id === id);
    if (found) return found.label;
    if (selectedLabels[id]) return selectedLabels[id];
    // If entities aren't loaded yet, show a short id prefix.
    return id.slice(0, 8);
  };

  const filtered = query.trim()
    ? entities.filter((e) =>
        e.label.toLowerCase().includes(query.trim().toLowerCase()) ||
        (e.subtitle ?? "").toLowerCase().includes(query.trim().toLowerCase())
      )
    : entities;

  // Refresh the entity list (used after creating a new entity so it shows up).
  async function reloadEntities() {
    if (!reference) return;
    setLoading(true);
    setError(null);
    const { data, error } = await fetchEntities(reference);
    if (error) setError(error);
    setEntities(data);
    setSelectedLabels((current) => ({
      ...current,
      ...Object.fromEntries(data.map((entity) => [entity.id, entity.label])),
    }));
    setLoading(false);
  }

  // Create a new entity inline, then auto-select it. Switches on the
  // reference type to call the right create function with the right payload.
  async function handleCreate() {
    if (!reference) return;
    // Validate required fields per type.
    const validationError = validateDraft(reference, draft);
    if (validationError) {
      setCreateError(validationError);
      return;
    }
    setCreating(true);
    setCreateError(null);
    const result = await submitCreate(reference, draft);
    setCreating(false);
    if (result.error || !result.id) {
      setCreateError(result.error ?? "Failed to create.");
      return;
    }
    // Refresh list so the new entity shows up, auto-select it, exit create mode.
    await reloadEntities();
    if (!value.includes(result.id)) {
      onChange([...value, result.id]);
    }
    setCreateMode(false);
    setDraft(blankDraft());
  }

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      <div className="flex flex-wrap gap-1.5">
        {value.length === 0 && (
          <span className="text-[12px] text-ink-faint italic">
            No {pluralLabel} selected.
          </span>
        )}
        {value.map((id) => (
          <span
            key={id}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] bg-accent-soft text-accent-ink border border-accent-border"
          >
            {labelFor(id)}
            <button
              type="button"
              onClick={() => toggle(id)}
              className="hover:text-danger"
              aria-label={`Remove ${labelFor(id)}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-hover"
      >
        <Plus size={14} /> Add {entityLabel}
      </button>

      {/* Picker modal */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[480px] max-w-[calc(100vw-2rem)] max-h-[80vh] rounded-[10px] bg-white border border-border shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
              <div className="flex items-center gap-2">
                {createMode && canCreate && (
                  <button
                    type="button"
                    onClick={() => { setCreateMode(false); setCreateError(null); }}
                    className="text-ink-faint hover:text-ink"
                    aria-label="Back to list"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <div>
                  <span className="text-[13px] font-semibold text-ink block">
                    {createMode && canCreate ? `New ${entityLabel}` : `Select ${pluralLabel}`}
                  </span>
                  <span className="text-[11px] text-ink-faint">
                    {createMode && canCreate ? "Create a new exam timer" : `${value.length} selected`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ink-faint hover:text-ink"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body: either the create form or the search + list */}
            {createMode && canCreate ? (
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {createError && (
                  <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
                    {createError}
                  </div>
                )}
                {reference === "examTimer" && (
                  <>
                    <CreateField label="Title *">
                      <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Physics Paper 2" autoFocus className={inputCls} />
                    </CreateField>
                    <CreateField label="Subject *">
                      <input type="text" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} placeholder="Physics" className={inputCls} />
                    </CreateField>
                    <div className="grid grid-cols-2 gap-3">
                      <CreateField label="Board">
                        <select value={draft.board} onChange={(e) => setDraft({ ...draft, board: e.target.value })} className={inputCls}>
                          {["Cambridge", "Edexcel", "AQA", "OCR"].map((b) => (<option key={b} value={b}>{b}</option>))}
                        </select>
                      </CreateField>
                      <CreateField label="Level">
                        <select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value as Level })} className={inputCls}>
                          {["O Level", "A Level", "AS Level", "A2 Level", "IGCSE"].map((l) => (<option key={l} value={l}>{l}</option>))}
                        </select>
                      </CreateField>
                    </div>
                    <CreateField label="Exam date & time">
                      <input type="datetime-local" value={draft.examDate} onChange={(e) => setDraft({ ...draft, examDate: e.target.value })} className={inputCls} />
                    </CreateField>
                  </>
                )}
                {reference === "teacher" && (
                  <>
                    <CreateField label="Name *">
                      <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Dr. Sana Mahmood" autoFocus className={inputCls} />
                    </CreateField>
                    <CreateField label="Subjects (comma-separated)">
                      <input type="text" value={draft.subjects} onChange={(e) => setDraft({ ...draft, subjects: e.target.value })} placeholder="Physics, Mathematics" className={inputCls} />
                    </CreateField>
                    <div className="grid grid-cols-2 gap-3">
                      <CreateField label="Level">
                        <select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value as Level })} className={inputCls}>
                          {["O Level", "A Level", "AS Level", "A2 Level", "IGCSE"].map((l) => (<option key={l} value={l}>{l}</option>))}
                        </select>
                      </CreateField>
                      <CreateField label="Years of experience">
                        <input type="number" min="0" value={draft.yearsExperience} onChange={(e) => setDraft({ ...draft, yearsExperience: Number(e.target.value) })} className={inputCls} />
                      </CreateField>
                    </div>
                  </>
                )}
                {reference === "course" && (
                  <>
                    <CreateField label="Title *">
                      <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="A Level Physics Crash Course" autoFocus className={inputCls} />
                    </CreateField>
                    <CreateField label="Subject *">
                      <input type="text" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} placeholder="Physics" className={inputCls} />
                    </CreateField>
                    <div className="grid grid-cols-2 gap-3">
                      <CreateField label="Level">
                        <select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value as Level })} className={inputCls}>
                          {["O Level", "A Level", "AS Level", "A2 Level", "IGCSE"].map((l) => (<option key={l} value={l}>{l}</option>))}
                        </select>
                      </CreateField>
                      <CreateField label="Price">
                        <input type="number" min="0" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className={inputCls} />
                      </CreateField>
                    </div>
                  </>
                )}
                {reference === "testimonial" && (
                  <>
                    <CreateField label="Student name *">
                      <input type="text" value={draft.studentName} onChange={(e) => setDraft({ ...draft, studentName: e.target.value })} placeholder="Ayesha K." autoFocus className={inputCls} />
                    </CreateField>
                    <CreateField label="Course *">
                      <input type="text" value={draft.course} onChange={(e) => setDraft({ ...draft, course: e.target.value })} placeholder="A Level Physics" className={inputCls} />
                    </CreateField>
                    <CreateField label="Result">
                      <input type="text" value={draft.result} onChange={(e) => setDraft({ ...draft, result: e.target.value })} placeholder="A*" className={inputCls} />
                    </CreateField>
                    <CreateField label="Quote *">
                      <textarea value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} placeholder="The small batches and past-paper drills made a huge difference..." rows={3} className={`${inputCls} h-auto py-2 resize-none`} />
                    </CreateField>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint"
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Search ${pluralLabel}…`}
                      className="w-full h-9 pl-8 pr-3 rounded-[6px] border border-border bg-white text-[13px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                      autoFocus
                    />
                  </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-2 flex-1">
                  {loading && (
                    <div className="py-8 flex items-center justify-center gap-2 text-[13px] text-ink-faint">
                      <Loader2 size={15} className="animate-spin" /> Loading…
                    </div>
                  )}
                  {!loading && error && (
                    <div className="py-6 px-3 text-[13px] text-red-600 bg-red-50 rounded-[6px] m-2">
                      {error}
                    </div>
                  )}
                  {!loading && !error && filtered.length === 0 && (
                    <div className="py-8 text-center text-[13px] text-ink-faint">
                      {entities.length === 0
                        ? `No ${pluralLabel} found. Add some in the ${entityLabel === "teacher" ? "Faculty" : entityLabel === "course" ? "Courses" : "related"} admin page first.`
                        : "No matches."}
                    </div>
                  )}
                  {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 gap-1">
                      {filtered.map((e) => {
                        const selected = value.includes(e.id);
                        return (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => toggle(e.id)}
                            className={`flex items-center gap-3 p-2.5 rounded-[6px] text-left transition-colors ${
                              selected
                                ? "bg-accent-soft border border-accent-border"
                                : "hover:bg-bg-muted border border-transparent"
                            }`}
                          >
                            {/* Photo / avatar */}
                            {e.photo ? (
                              <img
                                src={e.photo}
                                alt={e.label}
                                className="w-9 h-9 shrink-0 rounded-full object-cover bg-bg-muted"
                              />
                            ) : (
                              <div className="w-9 h-9 shrink-0 rounded-full bg-bg-muted flex items-center justify-center text-[12px] font-medium text-ink-faint">
                                {e.label.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-medium text-ink truncate">
                                {e.label}
                              </div>
                              {e.subtitle && (
                                <div className="text-[11px] text-ink-faint truncate">
                                  {e.subtitle}
                                </div>
                              )}
                            </div>
                            {selected && (
                              <Check size={16} className="text-accent shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-bg-subtle flex items-center justify-between">
              {createMode && canCreate ? (
                <>
                  <span className="text-[12px] text-ink-faint">Fields marked * are required</span>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating}
                    className="h-8 px-3 rounded-[6px] bg-accent text-white text-[13px] font-medium hover:bg-accent-hover disabled:opacity-60"
                  >
                    {creating ? "Creating…" : "Create & select"}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[12px] text-ink-faint">
                    {value.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    {canCreate && (
                      <button
                        type="button"
                        onClick={() => { setCreateMode(true); setCreateError(null); }}
                        className="h-8 px-3 rounded-[6px] border border-border bg-white text-[13px] font-medium text-ink hover:bg-bg-muted inline-flex items-center gap-1.5"
                      >
                        <Plus size={14} /> {createButtonLabel}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="h-8 px-3 rounded-[6px] bg-accent text-white text-[13px] font-medium hover:bg-accent-hover"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
