"use client";

import { Search, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminTopbar({ onMenuClick, title }: { onMenuClick: () => void; title?: string }) {
  return (
    <header className="h-14 bg-bg border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1.5 rounded-[6px] hover:bg-bg-muted text-ink-soft"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        {title && <h1 className="text-[15px] font-semibold text-ink">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center relative">
          <Search size={15} className="absolute left-2.5 text-ink-faint pointer-events-none" />
          <input
            placeholder="Search…"
            className="h-9 w-56 pl-8 pr-3 rounded-[6px] bg-bg-muted border border-transparent text-sm text-ink placeholder:text-ink-faint focus:bg-white focus:border-border-strong focus:outline-none transition-colors"
          />
        </div>
        <Button variant="ghost" size="sm" className="relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-danger" />
        </Button>
      </div>
    </header>
  );
}
