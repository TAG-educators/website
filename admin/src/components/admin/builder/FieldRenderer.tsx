"use client";

import { useState } from "react";
import { Plus, X, Link2, Image as ImageIcon, ChevronDown, ChevronRight } from "lucide-react";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { FileUpload } from "@/components/ui/FileUpload";
import type { FieldDef } from "@/lib/block-schema";
import { EntityPicker } from "./EntityPicker";

// ---------- Toggle switch ----------
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-accent" : "bg-border-strong"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ---------- CTA field (label + href pair) ----------
function CtaField({ value, onChange }: { value: { label: string; href: string } | null; onChange: (v: { label: string; href: string } | null) => void }) {
  const v = value ?? { label: "", href: "" };
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Button label"
          value={v.label}
          onChange={(e) => onChange({ ...v, label: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <Link2 size={14} className="text-ink-faint shrink-0" />
        <Input
          placeholder="/path or https://…"
          value={v.href}
          onChange={(e) => onChange({ ...v, href: e.target.value })}
        />
      </div>
      {value !== null && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-[12px] text-ink-faint hover:text-danger"
        >
          Remove CTA
        </button>
      )}
    </div>
  );
}

// ---------- Media field (URL + pick button placeholder) ----------
function MediaField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="/media/image.jpg or https://…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] bg-bg-muted text-ink-soft text-[13px] font-medium hover:bg-border-subtle border border-border-strong shrink-0"
      >
        <ImageIcon size={14} /> Pick
      </button>
    </div>
  );
}

// ---------- List field (repeatable sub-fields) ----------
function ListField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
}) {
  const subFields = field.subFields ?? [];

  const update = (index: number, key: string, val: unknown) => {
    const next = value.map((row, i) => (i === index ? { ...row, [key]: val } : row));
    onChange(next);
  };

  const addRow = () => {
    const row: Record<string, unknown> = {};
    for (const sf of subFields) {
      row[sf.key] = sf.default ?? (sf.type === "boolean" ? false : sf.type === "list" ? [] : "");
    }
    onChange([...value, row]);
  };

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="text-[12px] text-ink-faint italic">No items yet.</p>
      )}
      {value.map((row, i) => (
        <div key={i} className="rounded-[6px] border border-border bg-bg-subtle p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">
              Item {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="text-ink-faint hover:text-danger"
            >
              <X size={14} />
            </button>
          </div>
          {subFields.map((sf) => (
            <FieldRenderer
              key={sf.key}
              field={sf}
              value={row[sf.key]}
              onChange={(val) => update(i, sf.key, val)}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-hover"
      >
        <Plus size={14} /> Add item
      </button>
    </div>
  );
}

// ---------- Main field renderer ----------
export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <div>
      <Label>
        {field.label}
        {field.required && <span className="text-danger ml-0.5">*</span>}
      </Label>

      {field.type === "string" && (
        <Input
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.help ? `Enter ${field.label.toLowerCase()}` : undefined}
        />
      )}

      {field.type === "text" && (
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "richtext" && (
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[140px] font-mono text-[13px]"
          placeholder="Markdown or HTML…"
        />
      )}

      {field.type === "boolean" && (
        <div className="flex items-center gap-2 h-9">
          <Toggle checked={Boolean(value)} onChange={onChange} />
          <span className="text-[13px] text-ink-muted">{Boolean(value) ? "On" : "Off"}</span>
        </div>
      )}

      {field.type === "select" && (
        <Select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      )}

      {field.type === "media" && (
        <MediaField value={(value as string) ?? ""} onChange={onChange} />
      )}

      {field.type === "cta" && (
        <CtaField
          value={value as { label: string; href: string } | null}
          onChange={onChange}
        />
      )}

      {/* A field with type "list" + a `reference` is a multi-select of
          entities (teachers, courses, …) — render the entity picker.
          A plain "list" without a reference is a repeatable sub-form. */}
      {field.type === "list" && field.reference && (
        <EntityPicker
          field={field}
          value={(value as string[]) ?? []}
          onChange={onChange}
        />
      )}

      {field.type === "list" && !field.reference && (
        <ListField
          field={field}
          value={(value as Record<string, unknown>[]) ?? []}
          onChange={onChange}
        />
      )}

      {field.type === "reference" && (
        <EntityPicker
          field={field}
          value={(value as string[]) ?? []}
          onChange={onChange}
        />
      )}

      {field.help && field.type !== "boolean" && (
        <p className="mt-1 text-[12px] text-ink-faint">{field.help}</p>
      )}
    </div>
  );
}
