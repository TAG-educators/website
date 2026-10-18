"use client";

import { useEffect, useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { supabase } from "@/lib/supabase";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("contact_enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setEnquiries((data as Enquiry[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <PageHeader
        title="Contact Enquiries"
        description="Messages submitted through the contact form."
      />

      <Card>
        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading enquiries…</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-red-600 mb-2">Failed to load enquiries.</p>
            <p className="text-[12px] text-ink-faint">{error}</p>
          </div>
        ) : enquiries.length === 0 ? (
          <EmptyState
            title="No enquiries yet"
            description="Contact form submissions will appear here."
          />
        ) : (
          <div className="divide-y divide-border-subtle">
            {enquiries.map((e) => (
              <div key={e.id} className="p-4 hover:bg-bg-muted transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[6px] bg-accent-soft flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink text-[14px]">{e.name}</span>
                      <span className="text-[12px] text-ink-faint">
                        {new Date(e.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[12px] text-ink-muted">{e.email}</div>
                    {e.subject && (
                      <div className="text-[13px] text-ink-soft mt-1 font-medium">{e.subject}</div>
                    )}
                    <p className="text-[13px] text-ink-muted mt-1">{e.message}</p>
                    <a
                      href={`mailto:${e.email}`}
                      className="inline-flex items-center gap-1 text-[12px] text-accent hover:text-accent-hover font-medium mt-2"
                    >
                      Reply <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
