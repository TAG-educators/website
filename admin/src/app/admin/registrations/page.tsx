"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ClipboardList, ArrowRight, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

// Normalize phone to international digits for wa.me (no +, spaces, dashes)
function waNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchRegistrations } from "@/lib/registrations";
import type { Registration } from "@/lib/types";

const statusTone = {
  new: "info",
  contacted: "warning",
  enrolled: "success",
} as const;

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchRegistrations().then(({ data, error }) => {
      if (error) setError(error);
      else setRegistrations(data);
      setLoading(false);
    });
  }, []);

  const filtered = registrations.filter((r) => {
    const matchesQuery =
      r.studentName.toLowerCase().includes(query.toLowerCase()) ||
      r.parentName.toLowerCase().includes(query.toLowerCase()) ||
      r.email.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || r.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <>
      <PageHeader
        title="Registrations"
        description="Student enrollment inquiries and leads."
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email…" />
          <FilterDropdown
            value={status}
            onChange={setStatus}
            label="Filter by status"
            options={[
              { label: "All statuses", value: "all" },
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "Enrolled", value: "enrolled" },
            ]}
          />
          <div className="ml-auto text-[12px] text-ink-faint">
            {loading ? "Loading…" : `${filtered.length} of ${registrations.length}`}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading registrations…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load registrations.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No registrations found"
            description={query || status !== "all" ? "Try adjusting your search or filters." : "New registrations will appear here."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Student</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Parent</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Contact</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5">Courses</th>
                  <th className="text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5 w-28">Status</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: Registration) => (
                  <tr key={r.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/registrations/${r.id}`} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-bg-muted flex items-center justify-center text-[11px] font-semibold text-ink-soft shrink-0">
                          {r.studentName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium text-ink hover:text-accent">{r.studentName}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{r.parentName}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
                          <Mail size={12} /> {r.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
                          <Phone size={12} /> {r.phone}
                          {waNumber(r.phone) && (
                            <a
                              href={`https://wa.me/${waNumber(r.phone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`WhatsApp ${r.phone}`}
                              className="inline-flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded p-0.5 transition-colors"
                            >
                              <WhatsAppIcon size={13} />
                            </a>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.courses.map((c) => (
                          <Badge key={c} tone="neutral">{c}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[r.status]} className="capitalize">{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/registrations/${r.id}`} className="text-ink-faint hover:text-accent">
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
