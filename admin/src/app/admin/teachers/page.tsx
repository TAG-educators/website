"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, Star, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchTeachers } from "@/lib/teachers";
import type { Teacher } from "@/lib/types";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState("all");

  useEffect(() => {
    fetchTeachers().then(({ data, error }) => {
      if (error) setError(error);
      else setTeachers(data);
      setLoading(false);
    });
  }, []);

  const filtered = teachers.filter((t) => {
    const matchesQuery =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(query.toLowerCase()));
    const matchesFeatured =
      featured === "all" || (featured === "yes" && t.featured) || (featured === "no" && !t.featured);
    return matchesQuery && matchesFeatured;
  });

  return (
    <>
      <PageHeader
        title="Faculty"
        description="Manage your teaching staff and their profiles."
        action={
          <Link href="/admin/teachers/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Teacher
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search faculty…" />
          <FilterDropdown
            value={featured}
            onChange={setFeatured}
            label="Filter by featured"
            options={[
              { label: "All faculty", value: "all" },
              { label: "Featured", value: "yes" },
              { label: "Not featured", value: "no" },
            ]}
          />
          <div className="ml-auto text-[12px] text-ink-faint">
            {loading ? "Loading…" : `${filtered.length} of ${teachers.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading faculty…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load faculty.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No teachers found"
            description={query || featured !== "all" ? "Try adjusting your search or filters." : "Add your first teacher to get started."}
            action={
              !query && featured === "all" ? (
                <Link href="/admin/teachers/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New Teacher
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
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Name</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Subjects</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Levels</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Experience</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Featured</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t: Teacher) => (
                  <tr key={t.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/teachers/${t.id}`} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-bg-muted flex items-center justify-center text-[11px] font-semibold text-ink-soft shrink-0">
                          {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium text-ink hover:text-accent">{t.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.subjects.map((s) => (
                          <Badge key={s} tone="accent">{s}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.levels.map((l) => (
                          <Badge key={l} tone="neutral">{l}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{t.yearsExperience} yrs</td>
                    <td className="px-4 py-3">
                      {t.featured ? <Star size={15} className="text-warning fill-warning" /> : <span className="text-ink-faint">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/teachers/${t.id}`} className="text-ink-faint hover:text-accent">
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
