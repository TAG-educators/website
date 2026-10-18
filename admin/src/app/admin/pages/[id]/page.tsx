"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronDown, Eye, EyeOff, Copy, Trash2,
  ChevronUp, ChevronDown as Down, GripVertical, Save, Send, ExternalLink, Loader2, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import {
  fetchPageById,
  createPage,
  updatePage,
  deletePage,
  type PageData,
} from "@/lib/pages";
import {
  getBlockDef, defaultBlockData,
} from "@/lib/block-schema";
import type { Section, BlockType } from "@/lib/block-schema";
import { SectionEditor } from "@/components/admin/builder/SectionEditor";
import { AddSectionMenu } from "@/components/admin/builder/AddSectionMenu";

// Generate a short unique id for new sections
function newId() {
  return `s${Math.random().toString(36).slice(2, 9)}`;
}

function blankPage(): PageData {
  return {
    id: "",
    title: "Untitled Page",
    slug: "untitled-page",
    status: "draft",
    sections: [],
  };
}

export default function PageBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [page, setPage] = useState<PageData>(blankPage());
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchPageById(id).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setPage(data);
      setLoading(false);
    });
  }, [id, isNew]);

  // ---------- Section operations ----------
  const addSection = (type: BlockType) => {
    const section: Section = {
      id: newId(),
      type,
      hidden: false,
      desktopVisible: true,
      mobileVisible: true,
      data: defaultBlockData(type),
    };
    setPage({ ...page, sections: [...page.sections, section] });
    setExpanded(section.id);
  };

  const updateSectionData = (sectionId: string, data: Record<string, unknown>) => {
    setPage({
      ...page,
      sections: page.sections.map((s) => (s.id === sectionId ? { ...s, data } : s)),
    });
  };

  const toggleHidden = (sectionId: string) => {
    setPage({
      ...page,
      sections: page.sections.map((s) =>
        s.id === sectionId ? { ...s, hidden: !s.hidden } : s,
      ),
    });
  };

  const duplicateSection = (sectionId: string) => {
    const idx = page.sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;
    const copy: Section = {
      ...page.sections[idx],
      id: newId(),
      data: { ...page.sections[idx].data },
    };
    const next = [...page.sections];
    next.splice(idx + 1, 0, copy);
    setPage({ ...page, sections: next });
  };

  const deleteSection = (sectionId: string) => {
    setPage({
      ...page,
      sections: page.sections.filter((s) => s.id !== sectionId),
    });
    if (expanded === sectionId) setExpanded(null);
  };

  const moveSection = (sectionId: string, dir: -1 | 1) => {
    const idx = page.sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;
    const next = idx + dir;
    if (next < 0 || next >= page.sections.length) return;
    const sections = [...page.sections];
    [sections[idx], sections[next]] = [sections[next], sections[idx]];
    setPage({ ...page, sections });
  };

  // ---------- Page meta ----------
  const updateMeta = (key: "title" | "slug", value: string) => {
    setPage({ ...page, [key]: value });
  };

  // ---------- Save (real) ----------
  async function handleSave(newStatus: "draft" | "published") {
    setSaving(true);
    setError(null);
    setSaved(false);
    const payload = {
      title: page.title,
      slug: page.slug,
      status: newStatus,
      sections: page.sections,
    };
    if (isNew) {
      const { data, error } = await createPage(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/pages/${data.id}`);
    } else {
      const { error } = await updatePage(id, payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      setPage({ ...page, status: newStatus });
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deletePage(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/pages");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">
        Loading page…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Page not found.</p>
        <Link href="/admin/pages" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Pages
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/pages"
            className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-ink-muted hover:bg-bg-muted hover:text-ink shrink-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-semibold text-ink tracking-tight truncate">
                {page.title || "Untitled Page"}
              </h1>
              <StatusBadge status={page.status} />
            </div>
            <p className="text-[12px] text-ink-muted">/{page.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-[12px] text-success font-medium animate-pulse">Saved ✓</span>
          )}
          <Button variant="secondary" size="md" onClick={() => handleSave("draft")} disabled={saving}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save Draft
          </Button>
          <Button variant="secondary" size="md">
            <ExternalLink size={15} /> Preview
          </Button>
          <Button variant="primary" size="md" onClick={() => handleSave("published")} disabled={saving}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Publish
          </Button>
          {!isNew && (
            <Button variant="ghost" size="md" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              Delete
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {error}
        </div>
      )}

      {/* Page settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-4 bg-white border border-border rounded-[8px]">
        <div>
          <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Page Title</label>
          <Input
            value={page.title}
            onChange={(e) => updateMeta("title", e.target.value)}
            placeholder="Page title"
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Slug</label>
          <Input
            value={page.slug}
            onChange={(e) => updateMeta("slug", e.target.value)}
            placeholder="page-slug"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-ink-soft uppercase tracking-wide">
          Sections ({page.sections.length})
        </h2>
        <p className="text-[11px] text-ink-faint">
          Click a section to edit · use the icons to reorder, hide, duplicate, or delete
        </p>
      </div>

      <div className="space-y-2">
        {page.sections.length === 0 && (
          <div className="text-center py-16 bg-white border border-dashed border-border-strong rounded-[8px]">
            <div className="w-12 h-12 mx-auto mb-3 rounded-[10px] bg-accent-soft text-accent flex items-center justify-center">
              <Plus size={22} />
            </div>
            <p className="text-[15px] font-medium text-ink mb-1">No sections yet</p>
            <p className="text-[13px] text-ink-muted mb-4">
              Add your first block to start building this page.
            </p>
            <AddSectionMenu onAdd={addSection} />
          </div>
        )}

        {page.sections.map((section, index) => {
          const def = getBlockDef(section.type);
          const Icon = def.icon;
          const isOpen = expanded === section.id;
          return (
            <div
              key={section.id}
              className={`bg-white border rounded-[8px] overflow-hidden transition-shadow ${
                isOpen ? "border-accent shadow-sm" : "border-border"
              } ${section.hidden ? "opacity-60" : ""}`}
            >
              {/* Section header */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <GripVertical size={15} className="text-ink-faint shrink-0 cursor-grab" />

                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : section.id)}
                  className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                >
                  <div className="w-7 h-7 shrink-0 rounded-[6px] bg-accent-soft text-accent flex items-center justify-center">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-ink truncate">
                      {def.label}
                    </div>
                    <div className="text-[11px] text-ink-faint truncate">
                      {sectionPreview(section)}
                    </div>
                  </div>
                </button>

                {/* Inline actions */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <IconBtn
                    title="Move up"
                    onClick={() => moveSection(section.id, -1)}
                    disabled={index === 0}
                  >
                    <ChevronUp size={15} />
                  </IconBtn>
                  <IconBtn
                    title="Move down"
                    onClick={() => moveSection(section.id, 1)}
                    disabled={index === page.sections.length - 1}
                  >
                    <Down size={15} />
                  </IconBtn>
                  <IconBtn
                    title={section.hidden ? "Show" : "Hide"}
                    onClick={() => toggleHidden(section.id)}
                  >
                    {section.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                  </IconBtn>
                  <IconBtn title="Duplicate" onClick={() => duplicateSection(section.id)}>
                    <Copy size={15} />
                  </IconBtn>
                  <IconBtn
                    title="Delete"
                    onClick={() => deleteSection(section.id)}
                    danger
                  >
                    <Trash2 size={15} />
                  </IconBtn>
                  <IconBtn
                    title={isOpen ? "Collapse" : "Expand"}
                    onClick={() => setExpanded(isOpen ? null : section.id)}
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </IconBtn>
                </div>
              </div>

              {/* Section editor */}
              {isOpen && (
                <SectionEditor
                  section={section}
                  onChange={(data) => updateSectionData(section.id, data)}
                  onVisibilityChange={(visibility) =>
                    setPage({
                      ...page,
                      sections: page.sections.map((item) =>
                        item.id === section.id ? { ...item, ...visibility } : item,
                      ),
                    })
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Add section */}
      {page.sections.length > 0 && (
        <div className="mt-4">
          <AddSectionMenu onAdd={addSection} />
        </div>
      )}
    </>
  );
}

// ---------- Small icon button ----------
function IconBtn({
  children,
  title,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-[6px] text-ink-faint hover:bg-bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger ? "hover:text-danger hover:bg-danger-soft" : "hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

// ---------- Preview text for a section ----------
function sectionPreview(section: Section): string {
  const d = section.data;
  const title = (d.title as string) || (d.heading as string) || "";
  if (title) return title;
  const def = getBlockDef(section.type);
  return def.description;
}
