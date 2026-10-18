"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Star, Quote, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchTestimonials } from "@/lib/testimonials";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState("all");

  useEffect(() => {
    fetchTestimonials().then(({ data, error }) => {
      if (error) setError(error);
      else setTestimonials(data);
      setLoading(false);
    });
  }, []);

  const filtered = testimonials.filter((t) => {
    const matchesQuery =
      t.studentName.toLowerCase().includes(query.toLowerCase()) ||
      t.course.toLowerCase().includes(query.toLowerCase()) ||
      t.quote.toLowerCase().includes(query.toLowerCase());
    const matchesFeatured =
      featured === "all" || (featured === "yes" && t.featured) || (featured === "no" && !t.featured);
    return matchesQuery && matchesFeatured;
  });

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Student success stories and quotes."
        action={
          <Link href="/admin/testimonials/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Testimonial
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search testimonials…" />
          <FilterDropdown
            value={featured}
            onChange={setFeatured}
            label="Filter by featured"
            options={[
              { label: "All testimonials", value: "all" },
              { label: "Featured", value: "yes" },
              { label: "Not featured", value: "no" },
            ]}
          />
          <div className="ml-auto text-[12px] text-ink-faint">
            {loading ? "Loading…" : `${filtered.length} of ${testimonials.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading testimonials…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load testimonials.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No testimonials found"
            description={query || featured !== "all" ? "Try adjusting your search or filters." : "Add your first testimonial to get started."}
            action={
              !query && featured === "all" ? (
                <Link href="/admin/testimonials/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New Testimonial
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
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Student</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-28">Result</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Course</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Quote</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Featured</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t: Testimonial) => (
                  <tr key={t.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/testimonials/${t.id}`} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-bg-muted flex items-center justify-center text-[11px] font-semibold text-ink-soft shrink-0">
                          {t.studentName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium text-ink hover:text-accent">{t.studentName}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3"><Badge tone="success">{t.result}</Badge></td>
                    <td className="px-4 py-3 text-ink-soft">{t.course}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <Quote size={13} className="text-ink-faint shrink-0 mt-0.5" />
                        <span className="text-ink-muted text-[13px] truncate">{t.quote}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {t.featured ? <Star size={15} className="text-warning fill-warning" /> : <span className="text-ink-faint">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/testimonials/${t.id}`} className="text-ink-faint hover:text-accent">
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
