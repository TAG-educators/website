"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

// Normalize phone to international digits for wa.me (no +, spaces, dashes)
function waNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}
import {
  fetchRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from "@/lib/registrations";
import type { Registration } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Field } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const STATUSES: Registration["status"][] = ["new", "contacted", "enrolled"];

const statusTone: Record<Registration["status"], "info" | "warning" | "success"> = {
  new: "info",
  contacted: "warning",
  enrolled: "success",
};

function blankRegistration(): Registration {
  return {
    id: "",
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    location: "",
    parentPhone: "",
    courses: [],
    createdAt: new Date().toISOString(),
    status: "new",
  };
}

export default function RegistrationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [registration, setRegistration] = useState<Registration>(blankRegistration());
  const [coursesInput, setCoursesInput] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchRegistrationById(id).then(({ data, error }) => {
      if (error || !data) {
        setNotFound(true);
      } else {
        setRegistration(data);
        setCoursesInput(data.courses.join(", "));
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof Registration>(key: K, value: Registration[K]) {
    setRegistration((r) => ({ ...r, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      studentName: registration.studentName,
      parentName: registration.parentName,
      email: registration.email,
      phone: registration.phone,
      location: registration.location,
      parentPhone: registration.parentPhone,
      courses: registration.courses,
      status: registration.status,
    };

    if (isNew) {
      const { data, error } = await createRegistration(payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      if (data) router.replace(`/admin/registrations/${data.id}`);
    } else {
      const { error } = await updateRegistration(id, payload);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 1800);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!confirm(`Delete registration for ${registration.studentName}? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await deleteRegistration(id);
    if (error) {
      setError(error);
      setDeleting(false);
      return;
    }
    router.replace("/admin/registrations");
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">
        Loading registration…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-ink-muted">Registration not found.</p>
        <Link href="/admin/registrations" className="mt-3 inline-block text-accent hover:underline">
          ← Back to Registrations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/registrations"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Registrations
      </Link>

      <PageHeader
        title={isNew ? "New Registration" : registration.studentName || "Untitled Registration"}
        description={isNew ? "Create a new enrollment lead." : `Received ${new Date(registration.createdAt).toISOString().slice(0, 10)}`}
        action={
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-danger"
              onClick={handleDelete}
              disabled={deleting || isNew}
            >
              <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete"}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        <Card>
          <CardHeader title="Student" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Student Name">
              <Input value={registration.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="Aisha Rahman" />
            </Field>
            <Field label="Parent Name">
              <Input value={registration.parentName} onChange={(e) => update("parentName", e.target.value)} placeholder="Imran Rahman" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Contact" />
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <Input type="email" value={registration.email} onChange={(e) => update("email", e.target.value)} placeholder="aisha@example.com" />
            </Field>
            <Field label="Phone">
              <div className="flex items-center gap-2">
                <Input value={registration.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+92 300 1234567" />
                {waNumber(registration.phone) && (
                  <a
                    href={`https://wa.me/${waNumber(registration.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`WhatsApp ${registration.phone}`}
                    className="inline-flex items-center justify-center shrink-0 w-9 h-9 rounded-[8px] text-green-600 border border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 transition-colors"
                  >
                    <WhatsAppIcon size={15} />
                  </a>
                )}
              </div>
            </Field>
            <Field label="Location">
              <Input value={registration.location} onChange={(e) => update("location", e.target.value)} placeholder="Lahore" />
            </Field>
            <Field label="Parent Phone">
              <div className="flex items-center gap-2">
                <Input value={registration.parentPhone} onChange={(e) => update("parentPhone", e.target.value)} placeholder="+92 300 1234567" />
                {waNumber(registration.parentPhone) && (
                  <a
                    href={`https://wa.me/${waNumber(registration.parentPhone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`WhatsApp ${registration.parentPhone}`}
                    className="inline-flex items-center justify-center shrink-0 w-9 h-9 rounded-[8px] text-green-600 border border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 transition-colors"
                  >
                    <WhatsAppIcon size={15} />
                  </a>
                )}
              </div>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Courses" />
          <div className="p-4">
            <Field label="Interested Courses (comma-separated)" hint="e.g. Physics O Level, Chemistry O Level">
              <Input
                value={coursesInput}
                onChange={(e) => {
                  setCoursesInput(e.target.value);
                  update("courses", e.target.value.split(",").map((s) => s.trim()).filter(Boolean));
                }}
                placeholder="Physics O Level, Chemistry O Level"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Status" />
          <div className="p-4 grid sm:grid-cols-2 gap-4 items-end">
            <Field label="Lead Status">
              <Select
                value={registration.status}
                onChange={(e) => update("status", e.target.value as Registration["status"])}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </Select>
            </Field>
            <div className="flex items-center gap-2 pb-1">
              <span className="text-[12px] text-ink-faint">Current:</span>
              <Badge tone={statusTone[registration.status]}>{registration.status}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

