"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchBlogPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchBlogPosts().then(({ data, error }) => {
      if (error) setError(error);
      else setPosts(data);
      setLoading(false);
    });
  }, []);

  const filtered = posts.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || p.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <>
      <PageHeader
        title="Blog"
        description="Articles, study tips, and insights."
        action={
          <Link href="/admin/blog/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Article
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search articles…" />
          <FilterDropdown
            value={status}
            onChange={setStatus}
            label="Filter by status"
            options={[
              { label: "All", value: "all" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ]}
          />
          <div className="ml-auto text-[12px] text-ink-faint">
            {loading ? "Loading…" : `${filtered.length} of ${posts.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading articles…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load articles.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No articles found"
            description={query || status !== "all" ? "Try adjusting your search or filters." : "Write your first article to get started."}
            action={
              !query && status === "all" ? (
                <Link href="/admin/blog/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New Article
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
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-32">Category</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-28">Status</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-32">Updated</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-2.5">
                        <FileText size={15} className="text-ink-faint shrink-0" />
                        <span className="font-medium text-ink hover:text-accent">{p.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3"><Badge tone="neutral">{p.category}</Badge></td>
                    <td className="px-4 py-3">
                      <Badge tone={p.status === "published" ? "success" : p.status === "draft" ? "info" : "neutral"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-muted text-[13px]">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/blog/${p.id}`} className="text-ink-faint hover:text-accent">
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
