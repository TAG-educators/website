"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderOpen, Star, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchResources } from "@/lib/resources";
import type { Resource } from "@/lib/types";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    fetchResources().then(({ data, error }) => {
      if (error) setError(error);
      else setResources(data);
      setLoading(false);
    });
  }, []);

  const types = Array.from(new Set(resources.map((r) => r.type)));
  const levels = Array.from(new Set(resources.map((r) => r.level)));

  const filtered = resources.filter((r) => {
    const matchesQuery =
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.subject.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === "all" || r.type === type;
    const matchesLevel = level === "all" || r.level === level;
    return matchesQuery && matchesType && matchesLevel;
  });

  return (
    <>
      <PageHeader
        title="Resources"
        description="Notes, past papers, guides, and downloadable content."
        action={
          <Link href="/admin/resources/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Resource
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search resources…" />
          <FilterDropdown
            value={type}
            onChange={setType}
            label="Filter by type"
            options={[
              { label: "All types", value: "all" },
              ...types.map((t) => ({ label: t, value: t })),
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
            {loading ? "Loading…" : `${filtered.length} of ${resources.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading resources…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load resources.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No resources found"
            description={query || type !== "all" || level !== "all" ? "Try adjusting your search or filters." : "Add your first resource to get started."}
            action={
              !query && type === "all" && level === "all" ? (
                <Link href="/admin/resources/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New Resource
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
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-32">Type</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Subject</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Level</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Topic</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Featured</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: Resource) => (
                  <tr key={r.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/resources/${r.id}`} className="flex items-center gap-2.5">
                        <FolderOpen size={15} className="text-ink-faint shrink-0" />
                        <span className="font-medium text-ink hover:text-accent">{r.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3"><Badge tone="info">{r.type}</Badge></td>
                    <td className="px-4 py-3 text-ink-soft">{r.subject}</td>
                    <td className="px-4 py-3"><Badge tone="neutral">{r.level}</Badge></td>
                    <td className="px-4 py-3 text-ink-soft">{r.topic || "—"}</td>
                    <td className="px-4 py-3">
                      {r.featured ? <Star size={15} className="text-warning fill-warning" /> : <span className="text-ink-faint">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/resources/${r.id}`} className="text-ink-faint hover:text-accent">
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
