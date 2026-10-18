"use client";

import { useEffect, useState } from "react";
import { Save, Globe, Mail, Phone, MapPin, Link as LinkIcon, Type } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { fetchSettings, updateSettings, type SiteSettings } from "@/lib/settings";

function blankSettings(): SiteSettings {
  return {
    siteName: "",
    tagline: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    instagram: "",
    facebook: "",
    youtube: "",
    domain: "",
    metaDescription: "",
    font: "Inter",
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(blankSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings().then(({ data, error }) => {
      if (error) setError(error);
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error } = await updateSettings(settings);
    if (error) {
      setError(error);
      setSaving(false);
      return;
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-ink-faint">
        Loading settings…
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Site-wide configuration and contact information."
        action={
          <div className="flex items-center gap-2">
            {saved && <span className="text-[12px] text-success font-medium animate-pulse">Saved ✓</span>}
            <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
              <Save size={15} /> {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-4 max-w-3xl">
        {/* Organization */}
        <Card>
          <CardHeader title="Organization" />
          <div className="p-4 space-y-4">
            <Field label="Site Name">
              <Input value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} placeholder="TAG Educators" />
            </Field>
            <Field label="Tagline" hint="Short description shown in headers and SEO.">
              <Input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Where O & A Level students learn to score" />
            </Field>
            <Field label="Description" hint="Longer description for SEO and footer.">
              <Textarea value={settings.description} onChange={(e) => update("description", e.target.value)} placeholder="Small-batch O & A Level coaching with expert teachers across Cambridge and Edexcel." />
            </Field>
          </div>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader title="Contact Information" />
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email">
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <Input className="pl-9" value={settings.email} onChange={(e) => update("email", e.target.value)} placeholder="info@tageducators.com" />
                </div>
              </Field>
              <Field label="Phone">
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <Input className="pl-9" value={settings.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+92 300 1234567" />
                </div>
              </Field>
            </div>
            <Field label="Address">
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-ink-faint" />
                <Textarea className="pl-9" value={settings.address} onChange={(e) => update("address", e.target.value)} placeholder="Lahore, Pakistan" />
              </div>
            </Field>
          </div>
        </Card>

        {/* Social */}
        <Card>
          <CardHeader title="Social Links" />
          <div className="p-4 space-y-4">
            <Field label="Instagram">
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <Input className="pl-9" value={settings.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/tageducators" />
              </div>
            </Field>
            <Field label="Facebook">
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <Input className="pl-9" value={settings.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/tageducators" />
              </div>
            </Field>
            <Field label="YouTube">
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <Input className="pl-9" value={settings.youtube} onChange={(e) => update("youtube", e.target.value)} placeholder="https://youtube.com/@tageducators" />
              </div>
            </Field>
          </div>
        </Card>

        {/* Font */}
        <Card>
          <CardHeader title="Website Font" />
          <div className="p-4 space-y-4">
            <Field label="Font Family" hint="This font will be used across the entire public website.">
              <div className="relative">
                <Type size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <select
                  value={settings.font}
                  onChange={(e) => update("font", e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-[6px] border border-border bg-white text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                >
                  {["Inter", "Poppins", "Roboto", "Open Sans", "Lato", "Montserrat", "Playfair Display", "Source Sans Pro", "Nunito Sans", "DM Sans"].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </Field>
            <div className="rounded-[6px] border border-border bg-bg-subtle p-3">
              <span className="text-[11px] font-medium text-ink-muted uppercase tracking-wide block mb-1">Preview</span>
              <p
                className="text-[15px] text-ink"
                style={{ fontFamily: settings.font || "Inter" }}
              >
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
          </div>
        </Card>

        {/* Domain */}
        <Card>
          <CardHeader title="Domain & SEO" />
          <div className="p-4 space-y-4">
            <Field label="Primary Domain">
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <Input className="pl-9" value={settings.domain} onChange={(e) => update("domain", e.target.value)} placeholder="tageducators.com" />
              </div>
            </Field>
            <Field label="Meta Description" hint="Default description for pages without their own.">
              <Textarea value={settings.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} placeholder="Expert O & A Level coaching with small batches and proven results." />
            </Field>
          </div>
        </Card>
      </div>
    </>
  );
}
