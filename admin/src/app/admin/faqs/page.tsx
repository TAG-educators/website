"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, HelpCircle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchFaqs } from "@/lib/faqs";
import type { Faq } from "@/lib/types";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchFaqs().then(({ data, error }) => {
      if (error) setError(error);
      else setFaqs(data);
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const filtered = faqs.filter((f) => {
    const matchesQuery =
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || f.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <PageHeader
        title="FAQs"
        description="Frequently asked questions, organized by category."
        action={
          <Link href="/admin/faqs/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New FAQ
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search FAQs…" />
          <FilterDropdown
            value={category}
            onChange={setCategory}
            label="Filter by category"
            options={[
              { label: "All categories", value: "all" },
              ...categories.map((c) => ({ label: c, value: c })),
            ]}
          />
          <div className="ml-auto text-[12px] text-ink-faint">
            {loading ? "Loading…" : `${filtered.length} of ${faqs.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading FAQs…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load FAQs.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No FAQs found"
            description={query || category !== "all" ? "Try adjusting your search or filters." : "Add your first FAQ to get started."}
            action={
              !query && category === "all" ? (
                <Link href="/admin/faqs/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New FAQ
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
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-12">#</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Question</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Answer</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-32">Category</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f: Faq) => (
                  <tr key={f.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3 text-ink-faint">{f.sortOrder}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/faqs/${f.id}`} className="flex items-center gap-2.5">
                        <HelpCircle size={15} className="text-ink-faint shrink-0" />
                        <span className="font-medium text-ink hover:text-accent">{f.question}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <span className="text-ink-muted text-[13px] truncate block">{f.answer}</span>
                    </td>
                    <td className="px-4 py-3"><Badge tone="neutral">{f.category}</Badge></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/faqs/${f.id}`} className="text-ink-faint hover:text-accent">
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
