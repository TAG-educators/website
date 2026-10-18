"use client";

import { ChevronDown } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export function FilterDropdown({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
  label?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 pl-3 pr-8 rounded-[6px] bg-white border border-border-strong text-sm text-ink-soft appearance-none cursor-pointer focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
    </div>
  );
}
