"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelativeTime } from "@/components/ui/Time";
import { fetchPages, type PageSummary } from "@/lib/pages";

function PageRow({ page, depth = 0, allPages }: { page: PageSummary; depth?: number; allPages: PageSummary[] }) {
  const children = allPages.filter((p) => p.parentId === page.id);
  return (
    <>
      <tr className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
        <td className="px-4 py-3">
          <Link href={`/admin/pages/${page.id}`} className="flex items-center gap-2.5" style={{ paddingLeft: `${depth * 20}px` }}>
            <FileText size={15} className="text-ink-faint shrink-0" />
            <span className="font-medium text-ink hover:text-accent">{page.title}</span>
            {depth > 0 && <span className="text-[10px] text-ink-faint uppercase tracking-wider ml-1">sub-page</span>}
          </Link>
        </td>
        <td className="px-4 py-3 text-ink-muted">/{page.slug}</td>
        <td className="px-4 py-3 text-ink-muted">{page.sections}</td>
        <td className="px-4 py-3"><StatusBadge status={page.status} /></td>
        <td className="px-4 py-3 text-ink-muted"><RelativeTime iso={page.updatedAt} /></td>
        <td className="px-4 py-3 text-right">
          <Link href={`/admin/pages/${page.id}`} className="text-accent hover:text-accent-hover text-[12px] font-medium">
            Edit
          </Link>
        </td>
      </tr>
      {children.map((child) => (
        <PageRow key={child.id} page={child} depth={depth + 1} allPages={allPages} />
      ))}
    </>
  );
}

export default function PagesListPage() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchPages().then(({ data, error }) => {
      if (error) setError(error);
      setPages(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = pages.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.slug.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || p.status === status;
    return matchesQuery && matchesStatus;
  });

  // Build a tree: top-level pages with their children nested
  const topLevel = filtered.filter((p) => !p.parentId);
  const childrenOf = (parentId: string) => filtered.filter((p) => p.parentId === parentId);

  return (
    <>
      <PageHeader
        title="Pages"
        description="Manage your site's pages and their content sections."
        action={
          <Link href="/admin/pages/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Page
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {error}
        </div>
      )}

      <Card>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search pages…" />
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
          <div className="ml-auto text-[12px] text-ink-faint">
            {filtered.length} of {pages.length}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading pages…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No pages found"
            description={
              query || status !== "all"
                ? "Try adjusting your search or filters."
                : "Create your first page to get started."
            }
            action={
              !query && status === "all" ? (
                <Link href="/admin/pages/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New Page
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
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Slug</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Sections</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-28">Status</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-32">Updated</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {topLevel.map((p) => (
                  <PageRow key={p.id} page={p} allPages={filtered} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
