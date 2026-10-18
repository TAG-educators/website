"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Star, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchCourses } from "@/lib/courses";
import type { Course } from "@/lib/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    fetchCourses().then(({ data, error }) => {
      if (error) setError(error);
      else setCourses(data);
      setLoading(false);
    });
  }, []);

  const levels = Array.from(new Set(courses.map((c) => c.level)));

  const filtered = courses.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subject.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || c.status === status;
    const matchesLevel = level === "all" || c.level === level;
    return matchesQuery && matchesStatus && matchesLevel;
  });

  return (
    <>
      <PageHeader
        title="Courses"
        description="Manage your course catalog and pricing."
        action={
          <Link href="/admin/courses/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Course
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search courses…" />
          <FilterDropdown
            value={status}
            onChange={setStatus}
            label="Filter by status"
            options={[
              { label: "All statuses", value: "all" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ]}
          />
          <FilterDropdown
            value={level}
            onChange={setLevel}
            label="Filter by level"
            options={[
              { label: "All levels", value: "all" },
              ...levels.map((l) => ({ label: l, value: l })),
            ]}
          />
          <div className="ml-auto text-[12px] text-ink-faint">
            {loading ? "Loading…" : `${filtered.length} of ${courses.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading courses…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load courses.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No courses found"
            description={query || status !== "all" || level !== "all" ? "Try adjusting your search or filters." : "Create your first course to get started."}
            action={
              !query && status === "all" && level === "all" ? (
                <Link href="/admin/courses/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New Course
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Title</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Level</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Subject</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Price</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Featured</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-28">Status</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: Course) => (
                  <tr key={c.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/courses/${c.id}`} className="flex items-center gap-2.5">
                        <BookOpen size={15} className="text-ink-faint shrink-0" />
                        <span className="font-medium text-ink hover:text-accent">{c.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="neutral">{c.level}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{c.subject}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {c.originalPrice > 0 && c.originalPrice !== c.price ? (
                        <span>
                          <span className="line-through text-ink-faint">PKR {c.originalPrice}</span>
                          {" → "}
                          <span className="font-medium text-ink">PKR {c.price}</span>
                        </span>
                      ) : (
                        <span>PKR {c.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.featured ? <Star size={15} className="text-warning fill-warning" /> : <span className="text-ink-faint">—</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/courses/${c.id}`} className="text-ink-faint hover:text-accent">
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
