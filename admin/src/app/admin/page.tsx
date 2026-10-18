"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowUpRight, ArrowDownRight, Minus, Clock } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { RelativeTime, DaysUntil } from "@/components/ui/Time";
import { fetchRegistrations } from "@/lib/registrations";
import { fetchExamTimers } from "@/lib/examTimers";
import { fetchTeachers } from "@/lib/teachers";
import { fetchCourses } from "@/lib/courses";
import type { Registration, ExamTimer, DashboardStat } from "@/lib/types";

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [exams, setExams] = useState<ExamTimer[]>([]);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchRegistrations(),
      fetchExamTimers(),
      fetchTeachers(),
      fetchCourses(),
    ]).then(([regRes, examRes, teacherRes, courseRes]) => {
      const regs = regRes.data ?? [];
      const exs = examRes.data ?? [];
      const teachers = teacherRes.data ?? [];
      const courses = courseRes.data ?? [];
      setRegistrations(regs);
      setExams(exs);
      setStats([
        {
          label: "Registrations",
          value: regs.length,
          hint: "total leads",
          trend: {
            dir: "up",
            text: `${regs.filter((r) => r.status === "new").length} new`,
          },
        },
        {
          label: "Active Exams",
          value: exs.filter((e) => e.active).length,
          hint: `of ${exs.length} total`,
        },
        {
          label: "Teachers",
          value: teachers.length,
          hint: `${teachers.filter((t) => t.featured).length} featured`,
        },
        {
          label: "Courses",
          value: courses.length,
          hint: `${courses.filter((c) => c.status === "published").length} published`,
        },
      ]);
      setLoading(false);
    });
  }, []);

  const recentRegistrations = registrations.slice(0, 6);
  const upcomingExams = exams.filter((e) => e.active).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Good morning, Admin"
        description="Here's what's happening with your site today."
        action={
          <Link href="/admin/pages/new">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Page
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="text-[12px] font-medium text-ink-faint">Loading…</div>
              <div className="mt-1 h-7 w-16 bg-bg-muted rounded animate-pulse" />
            </Card>
          ))
        ) : (
          stats.map((s) => (
            <Card key={s.label} className="p-4">
              <div className="text-[12px] font-medium text-ink-muted">{s.label}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[26px] font-semibold text-ink tracking-tight">{s.value}</span>
                {s.hint && <span className="text-[12px] text-ink-faint">{s.hint}</span>}
              </div>
              {s.trend && (
                <div className="mt-2 flex items-center gap-1 text-[12px]">
                  {s.trend.dir === "up" && <ArrowUpRight size={13} className="text-success" />}
                  {s.trend.dir === "down" && <ArrowDownRight size={13} className="text-danger" />}
                  {s.trend.dir === "flat" && <Minus size={13} className="text-ink-faint" />}
                  <span className={s.trend.dir === "up" ? "text-success" : s.trend.dir === "down" ? "text-danger" : "text-ink-faint"}>
                    {s.trend.text}
                  </span>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent registrations */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Registrations"
            action={
              <Link href="/admin/registrations" className="text-[12px] text-accent hover:text-accent-hover font-medium">
                View all
              </Link>
            }
          />
          {loading ? (
            <div className="p-10 text-center text-[13px] text-ink-faint">Loading…</div>
          ) : recentRegistrations.length === 0 ? (
            <div className="p-10 text-center text-[13px] text-ink-faint">No registrations yet.</div>
          ) : (
            <DataTable<Registration>
              columns={[
                {
                  key: "studentName",
                  header: "Student",
                  render: (r) => (
                    <Link href={`/admin/registrations/${r.id}`} className="block">
                      <div className="font-medium text-ink hover:text-accent">{r.studentName}</div>
                      <div className="text-[12px] text-ink-faint">{r.courses.length} course(s)</div>
                    </Link>
                  ),
                },
                {
                  key: "courses",
                  header: "Courses",
                  render: (r) => <span className="text-ink-soft">{r.courses.join(", ")}</span>,
                },
                {
                  key: "createdAt",
                  header: "Received",
                  render: (r) => <span className="text-ink-muted"><RelativeTime iso={r.createdAt} /></span>,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => {
                    const tone = r.status === "new" ? "info" : r.status === "contacted" ? "warning" : "success";
                    return <Badge tone={tone}>{r.status}</Badge>;
                  },
                },
              ]}
              rows={recentRegistrations}
            />
          )}
        </Card>

        {/* Upcoming exams */}
        <Card>
          <CardHeader
            title="Upcoming Exams"
            action={
              <Link href="/admin/exam-timers" className="text-[12px] text-accent hover:text-accent-hover font-medium">
                Manage
              </Link>
            }
          />
          <div className="p-2">
            {loading ? (
              <div className="p-6 text-center text-[13px] text-ink-faint">Loading…</div>
            ) : upcomingExams.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-ink-faint">No active exam timers.</div>
            ) : (
              upcomingExams.map((e) => (
                <Link key={e.id} href={`/admin/exam-timers/${e.id}`} className="flex items-center gap-3 px-2 py-2.5 rounded-[6px] hover:bg-bg-muted">
                  <div className="w-10 h-10 rounded-[6px] bg-accent-soft flex flex-col items-center justify-center shrink-0">
                    <DaysUntil iso={e.examDate} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-ink truncate">{e.title}</div>
                    <div className="text-[12px] text-ink-muted">{e.level} · {e.subject}</div>
                  </div>
                  <Clock size={14} className="text-ink-faint ml-auto" />
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
