"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, Save, Loader2, FileText, Eye, EyeOff, Trash2,
  ChevronUp, ChevronDown as DownIcon, X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import {
  fetchPages, fetchPageById, updatePage, createPage,
  type PageSummary, type PageData,
} from "@/lib/pages";
import { fetchNavItems, type NavItem } from "@/lib/navigation";
import {
  getBlockDef, defaultBlockData, BLOCK_LIST,
  type Section, type BlockType,
} from "@/lib/block-schema";
import { SectionEditor } from "@/components/admin/builder/SectionEditor";
import { fetchCourses, createCourse } from "@/lib/courses";
import { fetchTeachers, createTeacher } from "@/lib/teachers";
import { fetchResources, createResource } from "@/lib/resources";
import type { Course, Teacher, Resource } from "@/lib/types";

// Generate a short unique id for new sections
function newId() {
  return `s${Math.random().toString(36).slice(2, 9)}`;
}

// Build a slug -> position map from nav items. A nav item's href like
// "/courses" maps to the page with slug "courses". The root href "/" maps
// to the "home" slug. This keeps the Pages tab order in sync with the Menu
// tab — reordering nav items reorders the page tabs automatically.
function buildSlugOrder(nav: NavItem[]): Record<string, number> {
  const order: Record<string, number> = {};
  nav.forEach((item, i) => {
    const slug = item.href === "/" ? "home" : item.href.replace(/^\//, "");
    order[slug] = item.position ?? i;
  });
  return order;
}

// Sort pages by their matching nav position. Pages without a matching nav
// item sort to the end, alphabetically by title.
function sortPages(pages: PageSummary[], nav: NavItem[]): PageSummary[] {
  const order = buildSlugOrder(nav);
  return [...pages].sort((a, b) => {
    const oa = order[a.slug];
    const ob = order[b.slug];
    // Pages with a nav position come first, ordered by position.
    if (oa !== undefined && ob !== undefined) return oa - ob;
    if (oa !== undefined) return -1;
    if (ob !== undefined) return 1;
    return a.title.localeCompare(b.title);
  });
}

// Preview text for a section (shown in the section tab label)
function sectionPreview(section: Section): string {
  const d = section.data;
  const title = (d.title as string) || (d.heading as string) || (d.eyebrow as string) || "";
  if (title) return title;
  const def = getBlockDef(section.type);
  return def.label;
}

// Convert legacy Resources "by level" card grids into resourceLibrary blocks
// so editors can manage real Topics + PDFs instead of comma-separated text.
function convertLegacyResourceSections(sections: Section[]): Section[] {
  return sections.map((section) => {
    const title = String(section.data?.title ?? "");
    const cards = Array.isArray(section.data?.cards) ? (section.data.cards as Array<Record<string, unknown>>) : [];
    const looksLikeByLevel =
      section.type === "cardGrid" &&
      /by level/i.test(title) &&
      cards.length > 0 &&
      cards.every((c) => typeof c.title === "string");

    if (!looksLikeByLevel) return section;

    const levels = cards.map((card) => {
      const levelName = String(card.title ?? "").trim();
      const topicNames = String(card.description ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      return {
        level: levelName,
        topics: topicNames.map((topic) => ({ topic, pdfs: [] })),
      };
    });

    return {
      ...section,
      type: "resourceLibrary",
      data: {
        eyebrow: String(section.data?.eyebrow ?? "By Level"),
        title: title || "Resource Library",
        levels,
      },
    };
  });
}

export function PagesTab() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Currently selected page
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [page, setPage] = useState<PageData | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  // Currently selected section within the page
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Add-section dropdown
  const [addOpen, setAddOpen] = useState(false);

  // New page dialog
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [creatingPage, setCreatingPage] = useState(false);
  const [newPageError, setNewPageError] = useState<string | null>(null);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);

  // Courses table (source of truth for the "Subjects" list under Content → Courses)
  const [courses, setCourses] = useState<Course[]>([]);
  // Faculty table (source of truth for the "Subjects" list under Content → Faculty)
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  // Resources table (source of truth for the "Subjects" list under Content → Resources)
  const [resources, setResources] = useState<Resource[]>([]);

  // Add-subject dialog (creates a course + its page inline)
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [newSubjectSlug, setNewSubjectSlug] = useState("");
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [newSubjectError, setNewSubjectError] = useState<string | null>(null);

  // Add-faculty dialog (creates a teacher + its page inline)
  const [addFacultyOpen, setAddFacultyOpen] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState("");
  const [newFacultySlug, setNewFacultySlug] = useState("");
  const [newFacultyRole, setNewFacultyRole] = useState("");
  const [creatingFaculty, setCreatingFaculty] = useState(false);
  const [newFacultyError, setNewFacultyError] = useState<string | null>(null);

  // Add-resource dialog (creates a resource + its page inline)
  const [addResourceOpen, setAddResourceOpen] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceSlug, setNewResourceSlug] = useState("");
  const [newResourceType, setNewResourceType] = useState<Resource["type"]>("Notes");
  const [newResourceSubject, setNewResourceSubject] = useState("");
  const [creatingResource, setCreatingResource] = useState(false);
  const [newResourceError, setNewResourceError] = useState<string | null>(null);

  // ---------- Load page list ----------
  // Fetch both pages and nav items in parallel, then sort pages by the nav
  // order so the page tabs follow whatever order is set in the Menu tab.
  useEffect(() => {
    Promise.all([fetchPages(), fetchNavItems(), fetchCourses(), fetchTeachers(), fetchResources()]).then(([pageRes, navRes, courseRes, teacherRes, resourceRes]) => {
      if (pageRes.error) setListError(pageRes.error);
      if (courseRes.data) setCourses(courseRes.data);
      if (teacherRes.data) setTeachers(teacherRes.data);
      if (resourceRes.data) setResources(resourceRes.data);
      if (pageRes.data && pageRes.data.length > 0) {
        const nav = navRes.data ?? [];
        const sorted = sortPages(pageRes.data, nav);
        setPages(sorted);
        // Select the first parent (top-level) page, not a child
        const firstParent = sorted.find((p) => !p.parentId);
        setActivePageId(firstParent?.id ?? sorted[0].id);
      }
      setLoadingList(false);
    });
  }, []);

  // ---------- Load the active page's full data ----------
  const loadPage = useCallback((id: string) => {
    setLoadingPage(true);
    setPageError(null);
    fetchPageById(id).then(async ({ data, error }) => {
      if (error || !data) {
        setPageError(error ?? "Page not found");
        setPage(null);
      } else {
        const converted = { ...data, sections: convertLegacyResourceSections(data.sections) };

        // Auto-sync courseGrid/teacherGrid blocks with showAll=true
        // so newly added courses/teachers appear without manual editing
        const needsSync = converted.sections.some(
          (s) =>
            (s.type === "courseGrid" && s.data?.showAll) ||
            (s.type === "teacherGrid" && s.data?.showAll)
        );

        if (needsSync) {
          const [courseRes, teacherRes] = await Promise.all([
            fetchCourses(),
            fetchTeachers(),
          ]);

          converted.sections = converted.sections.map((s) => {
            if (s.type === "courseGrid" && s.data?.showAll && courseRes.data) {
              const allCourseIds = courseRes.data.map((c) => c.id);
              const currentIds = (s.data.courseIds as string[]) || [];
              const hasNew = allCourseIds.some((id) => !currentIds.includes(id));
              const hasRemoved = currentIds.some((id) => !allCourseIds.includes(id));
              if (hasNew || hasRemoved) {
                return { ...s, data: { ...s.data, courseIds: allCourseIds } };
              }
            }
            if (s.type === "teacherGrid" && s.data?.showAll && teacherRes.data) {
              const allTeacherIds = teacherRes.data.map((t) => t.id);
              const currentIds = (s.data.teacherIds as string[]) || [];
              const hasNew = allTeacherIds.some((id) => !currentIds.includes(id));
              const hasRemoved = currentIds.some((id) => !allTeacherIds.includes(id));
              if (hasNew || hasRemoved) {
                return { ...s, data: { ...s.data, teacherIds: allTeacherIds } };
              }
            }
            return s;
          });
        }

        setPage(converted);
        // Auto-select the first section if any
        setActiveSectionId(converted.sections[0]?.id ?? null);

        // If we synced course/teacher IDs, auto-save to persist the change
        if (needsSync) {
          const syncedSections = converted.sections;
          updatePage(converted.id, {
            title: converted.title,
            slug: converted.slug,
            sections: syncedSections,
          }).then(({ error }) => {
            if (error) {
              console.error("Auto-sync save failed:", error);
            }
          });
        }
      }
      setLoadingPage(false);
    });
  }, []);

  useEffect(() => {
    if (activePageId) loadPage(activePageId);
  }, [activePageId, loadPage]);

  // ---------- Section operations ----------
  const updateSectionData = (sectionId: string, data: Record<string, unknown>) => {
    if (!page) return;
    setPage({
      ...page,
      sections: page.sections.map((s) => (s.id === sectionId ? { ...s, data } : s)),
    });
  };

  const toggleHidden = (sectionId: string) => {
    if (!page) return;
    setPage({
      ...page,
      sections: page.sections.map((s) =>
        s.id === sectionId ? { ...s, hidden: !s.hidden } : s,
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!page) return;
    if (!confirm("Delete this section? This cannot be undone.")) return;
    const next = page.sections.filter((s) => s.id !== sectionId);
    setPage({ ...page, sections: next });
    if (activeSectionId === sectionId) {
      setActiveSectionId(next[0]?.id ?? null);
    }
  };

  const moveSection = (sectionId: string, dir: -1 | 1) => {
    if (!page) return;
    const idx = page.sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;
    const next = idx + dir;
    if (next < 0 || next >= page.sections.length) return;
    const sections = [...page.sections];
    [sections[idx], sections[next]] = [sections[next], sections[idx]];
    setPage({ ...page, sections });
  };

  const addSection = (type: BlockType) => {
    if (!page) return;
    const section: Section = {
      id: newId(),
      type,
      hidden: false,
      desktopVisible: true,
      mobileVisible: true,
      data: defaultBlockData(type),
    };
    const next = [...page.sections, section];
    setPage({ ...page, sections: next });
    setActiveSectionId(section.id);
    setAddOpen(false);
  };

  // ---------- Create new page ----------
  async function handleCreatePage() {
    if (!newPageTitle.trim()) {
      setNewPageError("Please enter a page title.");
      return;
    }
    const slug = newPageSlug.trim() || newPageTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) {
      setNewPageError("Could not generate a valid slug.");
      return;
    }
    setCreatingPage(true);
    setNewPageError(null);
    const { data, error } = await createPage({
      title: newPageTitle.trim(),
      slug,
      status: "draft",
      sections: [],
    });
    setCreatingPage(false);
    if (error) {
      setNewPageError(error);
      return;
    }
    // Refresh the page list and select the new page
    setNewPageOpen(false);
    setNewPageTitle("");
    setNewPageSlug("");
    setNewPageError(null);
    const { data: fresh } = await fetchPages();
    if (fresh) {
      const navRes = await fetchNavItems();
      const sorted = sortPages(fresh, navRes.data ?? []);
      setPages(sorted);
      const created = sorted.find((p) => p.slug === slug);
      if (created) setActivePageId(created.id);
    }
  }

  // ---------- Page meta ----------
  const updateMeta = (key: "title" | "slug", value: string) => {
    if (!page) return;
    setPage({ ...page, [key]: value });
  };

  // ---------- Save all sections ----------
  // Publish: write the current in-memory sections to the live `sections`
  // column and clear any saved draft.
  async function handlePublish() {
    if (!page) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    const { error } = await updatePage(page.id, {
      title: page.title,
      slug: page.slug,
      sections: page.sections,
      draftSections: null,
    });
    if (error) {
      setSaveError(error);
    } else {
      setSaved(true);
      setPage({ ...page, draftSections: null });
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  // Preview: store the current sections as a draft (without touching the live
  // sections) and open the website in preview mode in a new tab.
  async function handlePreview() {
    if (!page) return;
    setPreviewing(true);
    setSaveError(null);
    const { error } = await updatePage(page.id, { draftSections: page.sections });
    if (error) {
      setSaveError(error);
      setPreviewing(false);
      return;
    }
    setPage({ ...page, draftSections: page.sections });
    setPreviewing(false);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";
    const path = page.slug === "home" ? "/" : `/${page.slug}`;
    window.open(`${origin}${path}?preview=1`, "_blank", "noopener");
  }

  // Undo / discard: clear any saved draft and revert the editor back to the
  // live published sections.
  async function handleDiscard() {
    if (!page) return;
    if (!confirm("Discard unsaved changes and revert to the published version?")) return;
    setSaving(true);
    setSaveError(null);
    const { error } = await updatePage(page.id, { draftSections: null });
    setSaving(false);
    if (error) {
      setSaveError(error);
      return;
    }
    // Re-fetch the published page to reset the editor state.
    await loadPage(page.id);
  }

  // Separate top-level pages from child (subject) pages. Declared here so the
  // course → page helpers below can reuse the same filtering logic.
  const parentPages = pages.filter((p) => !p.parentId);
  const childPages = pages.filter((p) => p.parentId);

  // ---------- Courses → page mapping helpers ----------
  // A course is "linked" to a child page when that page's slug matches
  // either `courses/<slug>` (seed convention) or the bare `<slug>`.
  function findChildPageForCourse(course: Course): PageSummary | undefined {
    return childPages.find(
      (p) => p.slug === `courses/${course.slug}` || p.slug === course.slug || p.title === course.title,
    );
  }

  // A faculty member is "linked" to a child page when that page's slug matches
  // `faculty/<slug>` (seed convention) or the bare `<slug>`.
  function findChildPageForFaculty(teacher: Teacher): PageSummary | undefined {
    return childPages.find(
      (p) => p.slug === `faculty/${teacher.slug}` || p.slug === teacher.slug || p.title === teacher.name,
    );
  }

  // A resource is "linked" to a child page when that page's slug matches
  // `resources/<slug>` (seed convention) or the bare `<slug>`.
  function findChildPageForResource(resource: Resource): PageSummary | undefined {
    return childPages.find(
      (p) => p.slug === `resources/${resource.slug}` || p.slug === resource.slug || p.title === resource.title,
    );
  }

  // Build the default sections for a course detail page.
  function coursePageSections(course: { slug: string; title: string; shortDescription?: string }, id?: string): Section[] {
    return [
      {
        id: `${course.slug}-hero`,
        type: "hero",
        hidden: false,
        desktopVisible: true,
        mobileVisible: true,
        data: {
          eyebrow: "Course Detail",
          title: course.title,
          description: course.shortDescription ?? "",
        },
      },
      {
        id: `${course.slug}-grid`,
        type: "courseGrid",
        hidden: false,
        desktopVisible: true,
        mobileVisible: true,
        data: { title: course.title, courseIds: id ? [id] : [], showAll: false },
      },
    ];
  }

  // Build the default sections for a faculty detail page.
  function facultyPageSections(teacher: { slug: string; name: string; role?: string; description?: string }): Section[] {
    return [
      {
        id: `${teacher.slug}-hero`,
        type: "hero",
        hidden: false,
        desktopVisible: true,
        mobileVisible: true,
        data: {
          eyebrow: teacher.role ?? "Faculty",
          title: teacher.name,
          description: teacher.description ?? "",
        },
      },
      {
        id: `${teacher.slug}-info`,
        type: "cardGrid",
        hidden: false,
        desktopVisible: true,
        mobileVisible: true,
        data: {
          eyebrow: "About",
          title: teacher.role ? `${teacher.name} — ${teacher.role}` : teacher.name,
          columns: "2",
          cards: [],
        },
      },
    ];
  }

  // Build the default sections for a resource detail page.
  function resourcePageSections(resource: { slug: string; title: string; excerpt?: string; subject?: string }): Section[] {
    return [
      {
        id: `${resource.slug}-hero`,
        type: "hero",
        hidden: false,
        desktopVisible: true,
        mobileVisible: true,
        data: {
          eyebrow: "Study Resources",
          title: `${resource.title} Resources`,
          description: resource.excerpt ?? `Browse ${resource.title} resources organized by level and topic.`,
        },
      },
      {
        id: `${resource.slug}-library`,
        type: "resourceLibrary",
        hidden: false,
        desktopVisible: true,
        mobileVisible: true,
        data: {
          eyebrow: "By Level",
          title: `${resource.title} Resource Library`,
          levels: [],
        },
      },
    ];
  }

  // Refresh the pages + courses + faculty lists after creating/linking a subject.
  async function refreshLists() {
    const [pageRes, navRes, courseRes, teacherRes, resourceRes] = await Promise.all([fetchPages(), fetchNavItems(), fetchCourses(), fetchTeachers(), fetchResources()]);
    if (courseRes.data) setCourses(courseRes.data);
    if (teacherRes.data) setTeachers(teacherRes.data);
    if (resourceRes.data) setResources(resourceRes.data);
    if (pageRes.data) {
      const sorted = sortPages(pageRes.data, navRes.data ?? []);
      setPages(sorted);
    }
    return pageRes.data;
  }

  // Clicking a course subject: open its existing page, or create one on the fly.
  async function openCourseSubject(course: Course) {
    const existing = findChildPageForCourse(course);
    if (existing) {
      setActivePageId(existing.id);
      return;
    }
    setCreatingSubject(true);
    setNewSubjectError(null);
    const { data, error } = await createPage({
      title: course.title,
      slug: `courses/${course.slug}`,
      status: "published",
      parentId: activePageId,
      sortOrder: courses.length,
      sections: coursePageSections(course, course.id),
    });
    if (error || !data) {
      setNewSubjectError(error ?? "Could not create the course page.");
      setCreatingSubject(false);
      return;
    }
    await refreshLists();
    setCreatingSubject(false);
    setActivePageId(data.id);
  }

  // "+" button: create a brand-new course AND its detail page.
  async function handleAddSubject() {
    const title = newSubjectTitle.trim();
    if (!title) {
      setNewSubjectError("Please enter a subject name.");
      return;
    }
    const slug =
      newSubjectSlug.trim() ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) {
      setNewSubjectError("Could not generate a valid slug.");
      return;
    }
    setCreatingSubject(true);
    setNewSubjectError(null);

    const { data: course, error: courseErr } = await createCourse({
      title,
      slug,
      shortDescription: "",
      longDescription: "",
      levels: ["O Level"],
      level: "O Level",
      subject: title,
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
      batchSize: 0,
    });

    if (courseErr || !course) {
      setNewSubjectError(courseErr ?? "Could not create the course.");
      setCreatingSubject(false);
      return;
    }

    const { data: pageData, error: pageErr } = await createPage({
      title,
      slug: `courses/${slug}`,
      status: "published",
      parentId: activePageId,
      sortOrder: courses.length,
      sections: coursePageSections({ slug, title }, course.id),
    });

    if (pageErr || !pageData) {
      setNewSubjectError(pageErr ?? "Could not create the course page.");
      setCreatingSubject(false);
      return;
    }

    await refreshLists();
    setAddSubjectOpen(false);
    setNewSubjectTitle("");
    setNewSubjectSlug("");
    setNewSubjectError(null);
    setCreatingSubject(false);
    setActivePageId(pageData.id);
  }

  // Clicking a faculty member: open its existing page, or create one on the fly.
  async function openFacultyMember(teacher: Teacher) {
    const existing = findChildPageForFaculty(teacher);
    if (existing) {
      setActivePageId(existing.id);
      return;
    }
    setCreatingFaculty(true);
    setNewFacultyError(null);
    const { data, error } = await createPage({
      title: teacher.name,
      slug: `faculty/${teacher.slug}`,
      status: "published",
      parentId: activePageId,
      sortOrder: teachers.length,
      sections: facultyPageSections(teacher),
    });
    if (error || !data) {
      setNewFacultyError(error ?? "Could not create the faculty page.");
      setCreatingFaculty(false);
      return;
    }
    await refreshLists();
    setCreatingFaculty(false);
    setActivePageId(data.id);
  }

  // "+" button: create a brand-new faculty member AND its detail page.
  async function handleAddFaculty() {
    const name = newFacultyName.trim();
    if (!name) {
      setNewFacultyError("Please enter a faculty member's name.");
      return;
    }
    const slug =
      newFacultySlug.trim() ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) {
      setNewFacultyError("Could not generate a valid slug.");
      return;
    }
    setCreatingFaculty(true);
    setNewFacultyError(null);

    const { data: teacher, error: teacherErr } = await createTeacher({
      name,
      slug,
      photo: null,
      role: newFacultyRole.trim() || "Faculty",
      description: "",
      qualifications: [],
      subjects: [],
      levels: ["O Level"],
      yearsExperience: 0,
      cambridgeCertified: false,
      imageQuery: "",
      experience: "",
      expertise: [],
      badges: [],
      stats: [],
      featured: false,
    });

    if (teacherErr || !teacher) {
      setNewFacultyError(teacherErr ?? "Could not create the faculty member.");
      setCreatingFaculty(false);
      return;
    }

    const { data: pageData, error: pageErr } = await createPage({
      title: name,
      slug: `faculty/${slug}`,
      status: "published",
      parentId: activePageId,
      sortOrder: teachers.length,
      sections: facultyPageSections({ slug, name, role: newFacultyRole.trim() || "Faculty" }),
    });

    if (pageErr || !pageData) {
      setNewFacultyError(pageErr ?? "Could not create the faculty page.");
      setCreatingFaculty(false);
      return;
    }

    await refreshLists();
    setAddFacultyOpen(false);
    setNewFacultyName("");
    setNewFacultySlug("");
    setNewFacultyRole("");
    setNewFacultyError(null);
    setCreatingFaculty(false);
    setActivePageId(pageData.id);
  }

  // Clicking a resource: open its existing page, or create one on the fly.
  async function openResource(resource: Resource) {
    const existing = findChildPageForResource(resource);
    if (existing) {
      setActivePageId(existing.id);
      return;
    }
    setCreatingResource(true);
    setNewResourceError(null);
    const { data, error } = await createPage({
      title: resource.title,
      slug: `resources/${resource.slug}`,
      status: "published",
      parentId: activePageId,
      sortOrder: resources.length,
      sections: resourcePageSections(resource),
    });
    if (error || !data) {
      setNewResourceError(error ?? "Could not create the resource page.");
      setCreatingResource(false);
      return;
    }
    await refreshLists();
    setCreatingResource(false);
    setActivePageId(data.id);
  }

  // "+" button: create a brand-new resource AND its detail page.
  async function handleAddResource() {
    const title = newResourceTitle.trim();
    if (!title) {
      setNewResourceError("Please enter a resource title.");
      return;
    }
    const slug =
      newResourceSlug.trim() ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) {
      setNewResourceError("Could not generate a valid slug.");
      return;
    }
    setCreatingResource(true);
    setNewResourceError(null);

    const { data: resource, error: resourceErr } = await createResource({
      title,
      slug,
      excerpt: "",
      type: newResourceType,
      subject: newResourceSubject.trim() || title,
      level: "O Level",
      topic: "",
      date: "",
      readTime: "5 min",
      icon: "FileText",
      url: null,
      featured: false,
    });

    if (resourceErr || !resource) {
      setNewResourceError(resourceErr ?? "Could not create the resource.");
      setCreatingResource(false);
      return;
    }

    const { data: pageData, error: pageErr } = await createPage({
      title,
      slug: `resources/${slug}`,
      status: "published",
      parentId: activePageId,
      sortOrder: resources.length,
      sections: resourcePageSections({ slug, title }),
    });

    if (pageErr || !pageData) {
      setNewResourceError(pageErr ?? "Could not create the resource page.");
      setCreatingResource(false);
      return;
    }

    await refreshLists();
    setAddResourceOpen(false);
    setNewResourceTitle("");
    setNewResourceSlug("");
    setNewResourceType("Notes");
    setNewResourceSubject("");
    setNewResourceError(null);
    setCreatingResource(false);
    setActivePageId(pageData.id);
  }

  // ---------- Render ----------
  if (loadingList) {
    return (
      <div className="py-10 text-center text-[13px] text-ink-faint">
        Loading pages…
      </div>
    );
  }

  if (listError) {
    return (
      <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
        {listError}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-dashed border-border-strong rounded-[8px]">
        <div className="w-12 h-12 mx-auto mb-3 rounded-[10px] bg-accent-soft text-accent flex items-center justify-center">
          <FileText size={22} />
        </div>
        <p className="text-[15px] font-medium text-ink mb-1">No pages yet</p>
        <p className="text-[13px] text-ink-muted mb-4">
          Create a page first from the Pages list, then manage its sections here.
        </p>
      </div>
    );
  }

  const activeSection = page?.sections.find((s) => s.id === activeSectionId) ?? null;

  const childrenOfActive = childPages.filter((p) => p.parentId === activePageId);

  // When the active parent page is "courses", its "Subjects" are driven by the
  // `courses` table (the same source of truth the public site reads from).
  const activeParent = parentPages.find((p) => p.id === activePageId);
  const isCoursesPage = activeParent?.slug === "courses";
  const isFacultyPage = activeParent?.slug === "faculty";
  const isResourcesPage = activeParent?.slug === "resources";
  const courseSubjects = isCoursesPage
    ? courses.map((c) => ({ course: c, page: findChildPageForCourse(c) ?? null }))
    : [];
  const facultyMembers = isFacultyPage
    ? teachers.map((t) => ({ teacher: t, page: findChildPageForFaculty(t) ?? null }))
    : [];
  const resourceSubjects = isResourcesPage
    ? resources.map((r) => ({ resource: r, page: findChildPageForResource(r) ?? null }))
    : [];

  // Number shown in parentheses next to each top-level page tab.
  function countForParent(p: PageSummary): number {
    if (p.slug === "courses") return courses.length;
    if (p.slug === "faculty") return teachers.length;
    if (p.slug === "resources") return resources.length;
    return childPages.filter((c) => c.parentId === p.id).length;
  }

  return (
    <div className="space-y-4">
      {/* Page tabs (top level — only parent pages) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-2">
        {parentPages.map((p) => {
          const active = p.id === activePageId;
          const count = countForParent(p);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePageId(p.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
                active
                  ? "bg-accent text-white"
                  : "bg-white text-ink-soft hover:bg-bg-muted border border-border"
              }`}
            >
              {p.title || "Untitled"}
              {count > 0 && (
                <span className={`text-[10px] ${active ? "text-white/60" : "text-ink-faint"}`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
        {/* Add page button */}
        <button
          type="button"
          onClick={() => setNewPageOpen(true)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-dashed border-border-strong text-ink-faint hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
          title="Add new page"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Sub-page tabs (subjects under the active parent) */}
      {(isCoursesPage || isFacultyPage || isResourcesPage || childrenOfActive.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 pl-4 border-l-2 border-accent/20">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint mr-1">
            Subjects:
          </span>
          {isCoursesPage
            ? courseSubjects.map(({ course, page: linkedPage }) => {
                const active = linkedPage?.id === activePageId;
                const draft = course.status !== "published";
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => openCourseSubject(course)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-accent-soft text-accent-ink border border-accent/30"
                        : linkedPage
                        ? "bg-white text-ink-soft hover:bg-bg-muted border border-border"
                        : "bg-white text-ink-soft hover:bg-bg-muted border border-dashed border-border-strong"
                    } ${draft ? "opacity-60" : ""}`}
                  >
                    {course.title}
                    {draft && (
                      <span className="text-[9px] uppercase tracking-wide text-ink-faint">draft</span>
                    )}
                  </button>
                );
              })
            : isFacultyPage
            ? facultyMembers.map(({ teacher, page: linkedPage }) => {
                const active = linkedPage?.id === activePageId;
                return (
                  <button
                    key={teacher.id}
                    type="button"
                    onClick={() => openFacultyMember(teacher)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-accent-soft text-accent-ink border border-accent/30"
                        : linkedPage
                        ? "bg-white text-ink-soft hover:bg-bg-muted border border-border"
                        : "bg-white text-ink-soft hover:bg-bg-muted border border-dashed border-border-strong"
                    }`}
                  >
                    {teacher.name}
                  </button>
                );
              })
            : isResourcesPage
            ? resourceSubjects.map(({ resource, page: linkedPage }) => {
                const active = linkedPage?.id === activePageId;
                return (
                  <button
                    key={resource.id}
                    type="button"
                    onClick={() => openResource(resource)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-accent-soft text-accent-ink border border-accent/30"
                        : linkedPage
                        ? "bg-white text-ink-soft hover:bg-bg-muted border border-border"
                        : "bg-white text-ink-soft hover:bg-bg-muted border border-dashed border-border-strong"
                    }`}
                  >
                    {resource.title}
                  </button>
                );
              })
            : childrenOfActive.map((p) => {
                const active = p.id === activePageId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePageId(p.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-accent-soft text-accent-ink border border-accent/30"
                        : "bg-white text-ink-soft hover:bg-bg-muted border border-border"
                    }`}
                  >
                    {p.title || "Untitled"}
                  </button>
                );
              })}
          {isCoursesPage && (
            <button
              type="button"
              onClick={() => setAddSubjectOpen(true)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] border border-dashed border-border-strong text-ink-faint hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
              title="Add subject"
            >
              <Plus size={15} />
            </button>
          )}
          {isFacultyPage && (
            <button
              type="button"
              onClick={() => setAddFacultyOpen(true)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] border border-dashed border-border-strong text-ink-faint hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
              title="Add faculty member"
            >
              <Plus size={15} />
            </button>
          )}
          {isResourcesPage && (
            <button
              type="button"
              onClick={() => setAddResourceOpen(true)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] border border-dashed border-border-strong text-ink-faint hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
              title="Add resource"
            >
              <Plus size={15} />
            </button>
          )}
        </div>
      )}

      {/* Active page content */}
      {loadingPage ? (
        <div className="py-10 text-center text-[13px] text-ink-faint">Loading page…</div>
      ) : pageError ? (
        <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {pageError}
        </div>
      ) : page ? (
        <div className="space-y-4">
          {/* Page meta + save bar */}
          <div className="flex flex-wrap items-end justify-between gap-3 p-4 bg-white border border-border rounded-[8px]">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Page Title</label>
                <Input
                  value={page.title}
                  onChange={(e) => updateMeta("title", e.target.value)}
                  placeholder="Page title"
                  className="w-[220px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Slug</label>
                <Input
                  value={page.slug}
                  onChange={(e) => updateMeta("slug", e.target.value)}
                  placeholder="page-slug"
                  className="w-[180px]"
                />
              </div>
              <StatusBadge status={page.status} />
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="text-[12px] text-success font-medium animate-pulse">Published ✓</span>
              )}
              <Button variant="ghost" size="md" onClick={handleDiscard} disabled={saving} title="Revert to the published version">
                Discard
              </Button>
              <Button variant="secondary" size="md" onClick={handlePreview} disabled={saving || previewing}>
                {previewing ? <Loader2 size={15} className="animate-spin" /> : <Eye size={15} />}
                Preview
              </Button>
              <Button variant="primary" size="md" onClick={handlePublish} disabled={saving}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Publish
              </Button>
            </div>
          </div>

          {saveError && (
            <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
              {saveError}
            </div>
          )}

          {page.draftSections && (
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-[8px] text-[13px]">
              <span className="text-amber-700 font-medium">A preview draft is saved but not published.</span>
              <button
                type="button"
                onClick={() => {
                  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";
                  const path = page.slug === "home" ? "/" : `/${page.slug}`;
                  window.open(`${origin}${path}?preview=1`, "_blank", "noopener");
                }}
                className="text-accent font-medium hover:underline"
              >
                View preview →
              </button>
            </div>
          )}

          {/* Section sub-tabs */}
          {page.sections.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                {page.sections.map((section) => {
                  const def = getBlockDef(section.type);
                  const Icon = def.icon;
                  const active = section.id === activeSectionId;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSectionId(section.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-accent-soft text-accent-ink border border-accent/30"
                          : "bg-white text-ink-soft hover:bg-bg-muted border border-border"
                      } ${section.hidden ? "opacity-60" : ""}`}
                    >
                      <Icon size={14} />
                      {sectionPreview(section)}
                      {section.hidden && <EyeOff size={12} className="text-ink-faint" />}
                    </button>
                  );
                })}
              </div>

              {/* Active section editor card */}
              {activeSection && (
                <SectionCard
                  section={activeSection}
                  index={page.sections.findIndex((s) => s.id === activeSection.id)}
                  total={page.sections.length}
                  onChange={(data) => updateSectionData(activeSection.id, data)}
                  onVisibilityChange={(visibility) =>
                    setPage({
                      ...page,
                      sections: page.sections.map((item) =>
                        item.id === activeSection.id ? { ...item, ...visibility } : item,
                      ),
                    })
                  }
                  onMove={(dir) => moveSection(activeSection.id, dir)}
                  onToggleHidden={() => toggleHidden(activeSection.id)}
                  onDelete={() => deleteSection(activeSection.id)}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white border border-dashed border-border-strong rounded-[8px]">
              <p className="text-[14px] font-medium text-ink mb-1">No sections on this page</p>
              <p className="text-[13px] text-ink-muted mb-4">
                Add your first block to start building this page.
              </p>
            </div>
          )}

          {/* Add section */}
          <AddSectionInline open={addOpen} setOpen={setAddOpen} onAdd={addSection} />
        </div>
      ) : null}

      {/* New Page Dialog */}
      {newPageOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setNewPageOpen(false)}
        >
          <div
            className="w-[420px] max-w-[calc(100vw-2rem)] rounded-[10px] bg-white border border-border shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
              <div>
                <span className="text-[14px] font-semibold text-ink block">Create New Page</span>
                <span className="text-[11px] text-ink-faint">Add a new page to your website</span>
              </div>
              <button
                type="button"
                onClick={() => setNewPageOpen(false)}
                className="text-ink-faint hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {newPageError && (
                <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
                  {newPageError}
                </div>
              )}
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Page Title</label>
                <Input
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    // Auto-generate slug from title
                    setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                  placeholder="e.g. Contact Us"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Slug (URL)</label>
                <Input
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="auto-generated from title"
                />
                <p className="mt-1 text-[11px] text-ink-faint">The page will be available at /{newPageSlug || "slug"}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-bg-subtle">
              <Button variant="ghost" size="sm" onClick={() => setNewPageOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreatePage} disabled={creatingPage}>
                {creatingPage ? "Creating…" : "Create Page"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Dialog (creates a course + its page) */}
      {addSubjectOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setAddSubjectOpen(false)}
        >
          <div
            className="w-[420px] max-w-[calc(100vw-2rem)] rounded-[10px] bg-white border border-border shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
              <div>
                <span className="text-[14px] font-semibold text-ink block">Add Subject</span>
                <span className="text-[11px] text-ink-faint">Creates the course and its page</span>
              </div>
              <button
                type="button"
                onClick={() => setAddSubjectOpen(false)}
                className="text-ink-faint hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {newSubjectError && (
                <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
                  {newSubjectError}
                </div>
              )}
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Subject Name</label>
                <Input
                  value={newSubjectTitle}
                  onChange={(e) => {
                    setNewSubjectTitle(e.target.value);
                    setNewSubjectSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                  placeholder="e.g. Physics"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Slug (URL)</label>
                <Input
                  value={newSubjectSlug}
                  onChange={(e) => setNewSubjectSlug(e.target.value)}
                  placeholder="auto-generated from name"
                />
                <p className="mt-1 text-[11px] text-ink-faint">The course will be available at /courses/{newSubjectSlug || "slug"}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-bg-subtle">
              <Button variant="ghost" size="sm" onClick={() => setAddSubjectOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddSubject} disabled={creatingSubject}>
                {creatingSubject ? "Creating…" : "Add Subject"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Faculty Dialog (creates a teacher + its page) */}
      {addFacultyOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setAddFacultyOpen(false)}
        >
          <div
            className="w-[420px] max-w-[calc(100vw-2rem)] rounded-[10px] bg-white border border-border shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
              <div>
                <span className="text-[14px] font-semibold text-ink block">Add Faculty Member</span>
                <span className="text-[11px] text-ink-faint">Creates the faculty member and their page</span>
              </div>
              <button
                type="button"
                onClick={() => setAddFacultyOpen(false)}
                className="text-ink-faint hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {newFacultyError && (
                <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
                  {newFacultyError}
                </div>
              )}
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Name</label>
                <Input
                  value={newFacultyName}
                  onChange={(e) => {
                    setNewFacultyName(e.target.value);
                    setNewFacultySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                  placeholder="e.g. Sarah Ahmed"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Role</label>
                <Input
                  value={newFacultyRole}
                  onChange={(e) => setNewFacultyRole(e.target.value)}
                  placeholder="e.g. Physics Teacher"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Slug (URL)</label>
                <Input
                  value={newFacultySlug}
                  onChange={(e) => setNewFacultySlug(e.target.value)}
                  placeholder="auto-generated from name"
                />
                <p className="mt-1 text-[11px] text-ink-faint">The faculty member will be available at /faculty/{newFacultySlug || "slug"}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-bg-subtle">
              <Button variant="ghost" size="sm" onClick={() => setAddFacultyOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddFaculty} disabled={creatingFaculty}>
                {creatingFaculty ? "Creating…" : "Add Faculty"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Dialog (creates a resource + its page) */}
      {addResourceOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setAddResourceOpen(false)}
        >
          <div
            className="w-[420px] max-w-[calc(100vw-2rem)] rounded-[10px] bg-white border border-border shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
              <div>
                <span className="text-[14px] font-semibold text-ink block">Add Resource</span>
                <span className="text-[11px] text-ink-faint">Creates the resource and its page</span>
              </div>
              <button
                type="button"
                onClick={() => setAddResourceOpen(false)}
                className="text-ink-faint hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {newResourceError && (
                <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
                  {newResourceError}
                </div>
              )}
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Title</label>
                <Input
                  value={newResourceTitle}
                  onChange={(e) => {
                    setNewResourceTitle(e.target.value);
                    setNewResourceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                  placeholder="e.g. Physics Past Papers"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Type</label>
                <select
                  value={newResourceType}
                  onChange={(e) => setNewResourceType(e.target.value as Resource["type"])}
                  className="w-full h-9 rounded-[6px] border border-border bg-white px-2 text-[13px] text-ink"
                >
                  <option value="Notes">Notes</option>
                  <option value="Past Paper">Past Paper</option>
                  <option value="Solved Paper">Solved Paper</option>
                  <option value="Video">Video</option>
                  <option value="Guide">Guide</option>
                  <option value="Link">Link</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Subject</label>
                <Input
                  value={newResourceSubject}
                  onChange={(e) => setNewResourceSubject(e.target.value)}
                  placeholder="e.g. Physics"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Slug (URL)</label>
                <Input
                  value={newResourceSlug}
                  onChange={(e) => setNewResourceSlug(e.target.value)}
                  placeholder="auto-generated from title"
                />
                <p className="mt-1 text-[11px] text-ink-faint">The resource will be available at /resources/{newResourceSlug || "slug"}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-bg-subtle">
              <Button variant="ghost" size="sm" onClick={() => setAddResourceOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddResource} disabled={creatingResource}>
                {creatingResource ? "Creating…" : "Add Resource"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Section editor card ----------
function SectionCard({
  section,
  index,
  total,
  onChange,
  onVisibilityChange,
  onMove,
  onToggleHidden,
  onDelete,
}: {
  section: Section;
  index: number;
  total: number;
  onChange: (data: Record<string, unknown>) => void;
  onVisibilityChange: (visibility: Pick<Section, "desktopVisible" | "mobileVisible">) => void;
  onMove: (dir: -1 | 1) => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  const def = getBlockDef(section.type);
  const Icon = def.icon;
  return (
    <div className="bg-white border border-accent/30 rounded-[8px] overflow-hidden shadow-sm">
      {/* Section header with actions */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg-subtle">
        <div className="w-7 h-7 shrink-0 rounded-[6px] bg-accent-soft text-accent flex items-center justify-center">
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-ink">{def.label}</div>
          <div className="text-[11px] text-ink-faint">{def.description}</div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <IconBtn title="Move up" onClick={() => onMove(-1)} disabled={index === 0}>
            <ChevronUp size={15} />
          </IconBtn>
          <IconBtn title="Move down" onClick={() => onMove(1)} disabled={index === total - 1}>
            <DownIcon size={15} />
          </IconBtn>
          <IconBtn title={section.hidden ? "Show" : "Hide"} onClick={onToggleHidden}>
            {section.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
          </IconBtn>
          <IconBtn title="Delete" onClick={onDelete} danger>
            <Trash2 size={15} />
          </IconBtn>
        </div>
      </div>

      {/* Section editor form */}
      <SectionEditor
        section={section}
        onChange={onChange}
        onVisibilityChange={onVisibilityChange}
      />
    </div>
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

// ---------- Inline Add Section dropdown ----------
function AddSectionInline({
  open,
  setOpen,
  onAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onAdd: (type: BlockType) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-[8px] border border-dashed border-border-strong text-ink-soft text-sm font-medium hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
      >
        <Plus size={18} /> Add Section
      </button>

      {open && (
        <>
          {/* Click-away overlay + centered modal */}
          <div
            className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-[460px] max-w-[calc(100vw-2rem)] max-h-[80vh] rounded-[10px] bg-white border border-border shadow-xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
                <div>
                  <span className="text-[13px] font-semibold text-ink block">Choose a block type</span>
                  <span className="text-[11px] text-ink-faint">Pick one to add it to your page</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ink-faint hover:text-ink"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="overflow-y-auto p-2 grid grid-cols-1 gap-1">
                {BLOCK_LIST.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.type}
                      type="button"
                      onClick={() => onAdd(block.type)}
                      className="flex items-start gap-3 p-3 rounded-[6px] text-left hover:bg-bg-muted transition-colors"
                    >
                      <div className="w-9 h-9 shrink-0 rounded-[8px] bg-accent-soft text-accent flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-ink">{block.label}</div>
                        <div className="text-[11px] text-ink-faint">{block.description}</div>
                      </div>
                      <Plus size={14} className="text-ink-faint mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
