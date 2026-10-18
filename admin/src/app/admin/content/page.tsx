"use client";

import { useState } from "react";
import { FileText, Menu as MenuIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PagesTab } from "@/components/admin/content/PagesTab";
import { MenuTab } from "@/components/admin/content/MenuTab";

type Tab = "pages" | "menu";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "pages", label: "Pages", icon: FileText },
  { id: "menu", label: "Menu", icon: MenuIcon },
];

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("pages");

  return (
    <>
      <PageHeader
        title="Content"
        description="Manage your site's pages, sections, and navigation menu."
      />

      {/* Top-level tabs: Pages | Menu */}
      <div className="flex items-center gap-1.5 mb-5 border-b border-border">
        {TABS.map((t) => {
          const active = t.id === tab;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium border-b-2 transition-colors -mb-px ${
                active
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:text-ink hover:bg-bg-muted"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active tab panel */}
      {tab === "pages" ? <PagesTab /> : <MenuTab />}
    </>
  );
}
