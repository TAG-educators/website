"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Timer, ArrowRight, Calendar } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchExamTimers } from "@/lib/examTimers";
import type { ExamTimer } from "@/lib/types";

export default function ExamTimersPage() {
  const [exams, setExams] = useState<ExamTimer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  useEffect(() => {
    fetchExamTimers().then(({ data, error }) => {
      if (error) setError(error);
      else setExams(data);
      setLoading(false);
    });
  }, []);

  const filtered = exams.filter((e) => {
    const matchesQuery =
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.subject.toLowerCase().includes(query.toLowerCase()) ||
      e.board.toLowerCase().includes(query.toLowerCase());
    const matchesActive =
      active === "all" || (active === "yes" && e.active) || (active === "no" && !e.active);
    return matchesQuery && matchesActive;
  });

  return (
    <>
      <PageHeader
        title="Exam Timers"
        description="Countdown timers for upcoming exams."
        action={
          <Link href="/admin/exam-timers/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Timer
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search exams…" />
          <FilterDropdown
            value={active}
            onChange={setActive}
            label="Filter by status"
            options={[
              { label: "All timers", value: "all" },
              { label: "Active", value: "yes" },
              { label: "Inactive", value: "no" },
            ]}
          />
          <div className="ml-auto text-[12px] text-ink-faint">
            {loading ? "Loading…" : `${filtered.length} of ${exams.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading exam timers…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load exam timers.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No exam timers found"
            description={query || active !== "all" ? "Try adjusting your search or filters." : "Create your first exam timer to get started."}
            action={
              !query && active === "all" ? (
                <Link href="/admin/exam-timers/new">
                  <Button variant="primary" size="md">
                    <Plus size={15} /> New Timer
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
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Board</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Level</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Subject</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-40">Exam Date</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Featured</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-24">Active</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e: ExamTimer) => (
                  <tr key={e.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/exam-timers/${e.id}`} className="flex items-center gap-2.5">
                        <Timer size={15} className="text-ink-faint shrink-0" />
                        <span className="font-medium text-ink hover:text-accent">{e.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3"><Badge tone="neutral">{e.board}</Badge></td>
                    <td className="px-4 py-3"><Badge tone="accent">{e.level}</Badge></td>
                    <td className="px-4 py-3 text-ink-soft">{e.subject}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-ink-soft text-[13px]">
                        <Calendar size={13} className="text-ink-faint" />
                        {new Date(e.examDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {e.featured ? <Badge tone="warning">Featured</Badge> : <span className="text-ink-faint">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={e.active ? "success" : "neutral"}>{e.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/exam-timers/${e.id}`} className="text-ink-faint hover:text-accent">
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
