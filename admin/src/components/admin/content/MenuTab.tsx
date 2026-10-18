"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Loader2, Trash2, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import {
  fetchNavItems, updateNavItems,
  type NavItem,
} from "@/lib/navigation";
import { fetchPages, createPage, deletePage } from "@/lib/pages";

// Derive the page slug a nav item points to.
// "/" -> "home", "/contact" -> "contact", "/about/us" -> "about-us".
function hrefToSlug(href: string): string {
  if (!href || href === "/") return "home";
  return href
    .replace(/^https?:\/\/[^/]+/, "") // strip origin if absolute
    .replace(/^\//, "") // leading slash
    .replace(/\/$/, "") // trailing slash
    .replace(/\//g, "-") // slashes -> dashes
    || "home";
}

// Temporary id for items that haven't been persisted yet (so React keys stay stable)
function tempId() {
  return `tmp_${Math.random().toString(36).slice(2, 9)}`;
}

export function MenuTab() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Load ----------
  useEffect(() => {
    fetchNavItems().then(({ data, error }) => {
      if (error) setError(error);
      if (data) setItems(data);
      setLoading(false);
    });
  }, []);

  // ---------- Mutations (local state; persisted on Save) ----------
  const updateItem = (id: string, patch: Partial<NavItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const addItem = () => {
    const item: NavItem = {
      id: tempId(),
      label: "New Link",
      href: "/",
      position: items.length,
      visible: true,
    };
    setItems((prev) => [...prev, item]);
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx === -1) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      // Re-normalize positions
      return arr.map((it, i) => ({ ...it, position: i }));
    });
  };

  // ---------- Save ----------
  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error } = await updateNavItems(items);
    if (error) {
      setError(error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // Re-fetch to get fresh ids/positions from the DB
      fetchNavItems().then(({ data }) => {
        if (data) setItems(data);
      });

      // Sync pages with the nav list:
      //  1. Create a draft page for any nav link that doesn't have one yet
      //     (so a newly-added menu link shows up in the Pages tab).
      //  2. Delete empty draft pages whose slug no longer matches any nav
      //     item (so removing a menu link cleans up its empty page). Pages
      //     with content (sections) are never auto-deleted — only empty drafts.
      try {
        const { data: existing } = await fetchPages();
        const navSlugs = new Set(items.map((it) => hrefToSlug(it.href)));
        await Promise.all(
          (existing ?? []).map(async (p) => {
            // Skip pages that still have a matching nav link.
            if (navSlugs.has(p.slug)) return;
            // Only auto-delete empty draft pages — never touch pages with
            // content, even if their nav link was removed.
            if (p.sections === 0 && p.status === "draft") {
              await deletePage(p.id);
            }
          }),
        );
        await Promise.all(
          items.map(async (item) => {
            const slug = hrefToSlug(item.href);
            if ((existing ?? []).some((p) => p.slug === slug)) return;
            await createPage({
              title: item.label || slug,
              slug,
              status: "draft",
              sections: [],
            });
          }),
        );
      } catch {
        // Page sync is best-effort; don't fail the nav save if it errors.
      }
    }
    setSaving(false);
  }

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="py-10 text-center text-[13px] text-ink-faint">
        Loading navigation…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink flex items-center gap-2">
            <MenuIcon size={16} /> Navigation Management
          </h3>
          <p className="text-[12px] text-ink-muted mt-0.5">
            Edit the links in your site header. Toggle visibility to show/hide without deleting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-[12px] text-success font-medium animate-pulse">Saved ✓</span>
          )}
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save Navigation
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {error}
        </div>
      )}

      {/* Nav items list */}
      <div className="bg-white border border-border rounded-[8px] divide-y divide-border-subtle">
        {items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-[13px] text-ink-muted mb-3">No navigation items yet.</p>
            <Button variant="secondary" size="md" onClick={addItem}>
              <Plus size={15} /> Add First Link
            </Button>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3"
            >
              {/* Label */}
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[11px] font-medium text-ink-faint mb-1">Label</label>
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  placeholder="Home"
                />
              </div>

              {/* Link */}
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[11px] font-medium text-ink-faint mb-1">Link</label>
                <Input
                  value={item.href}
                  onChange={(e) => updateItem(item.id, { href: e.target.value })}
                  placeholder="/about"
                />
              </div>

              {/* Visibility */}
              <div className="flex flex-col items-start">
                <label className="block text-[11px] font-medium text-ink-faint mb-1">Visibility</label>
                <Toggle
                  checked={item.visible}
                  onChange={(v) => updateItem(item.id, { visible: v })}
                  label={item.visible ? "Visible" : "Hidden"}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 self-end">
                <button
                  type="button"
                  title="Move up"
                  onClick={() => moveItem(item.id, -1)}
                  disabled={index === 0}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-ink-faint hover:bg-bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ▲
                </button>
                <button
                  type="button"
                  title="Move down"
                  onClick={() => moveItem(item.id, 1)}
                  disabled={index === items.length - 1}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-ink-faint hover:bg-bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ▼
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-ink-faint hover:text-danger hover:bg-danger-soft transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add item button */}
      {items.length > 0 && (
        <Button variant="secondary" size="md" onClick={addItem}>
          <Plus size={15} /> Add Navigation Item
        </Button>
      )}
    </div>
  );
}
