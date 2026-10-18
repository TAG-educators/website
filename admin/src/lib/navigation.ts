import { supabase } from "./supabase";

/**
 * Navigation items data layer.
 *
 * Table: navigation_items
 *   id          uuid pk
 *   label       text
 *   href        text
 *   position    int     (lower = earlier in the menu)
 *   visible     boolean (hidden items are kept in admin but not rendered on the public site)
 *   created_at  timestamptz
 *
 * The public header reads visible items ordered by position; the admin
 * Menu tab manages the full list (including hidden items).
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  position: number;
  visible: boolean;
}

interface NavItemRow {
  id: string;
  label: string;
  href: string;
  position: number;
  visible: boolean;
  created_at: string;
}

const TABLE = "navigation_items";

function rowToNavItem(r: NavItemRow): NavItem {
  return {
    id: r.id,
    label: r.label,
    href: r.href,
    position: r.position,
    visible: r.visible,
  };
}

/** Fetch all navigation items, ordered by position (admin view). */
export async function fetchNavItems(): Promise<{
  data: NavItem[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("position", { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: (data as NavItemRow[]).map(rowToNavItem), error: null };
}

/** Fetch only visible navigation items, ordered by position (public view). */
export async function fetchVisibleNavItems(): Promise<{
  data: NavItem[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("visible", true)
    .order("position", { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: (data as NavItemRow[]).map(rowToNavItem), error: null };
}

/**
 * Replace the entire navigation set in one transaction-like sequence.
 *
 * Strategy: delete all existing rows, then insert the provided list with
 * normalized positions (0..n-1). This keeps the admin "Save Navigation"
 * flow simple — the caller passes the full desired list and we make the
 * DB match it exactly.
 *
 * If any step fails we return the first error encountered. Because the
 * delete + insert are separate statements there is a brief window where
 * the table is empty; for a low-traffic nav menu this is acceptable and
 * far simpler than a diff/patch approach.
 */
export async function updateNavItems(items: NavItem[]): Promise<{
  error: string | null;
}> {
  // Normalize positions to a contiguous 0-based sequence so ordering
  // stays stable regardless of what the caller passed in.
  const ordered = items
    .map((item, index) => ({
      id: item.id || undefined,
      label: item.label,
      href: item.href,
      position: index,
      visible: item.visible,
    }))
    .sort((a, b) => a.position - b.position);

  // 1. Delete everything.
  const { error: delError } = await supabase.from(TABLE).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) return { error: delError.message };

  // 2. Insert the new set (only if there's anything to insert).
  if (ordered.length === 0) return { error: null };

  const rows = ordered.map((item) => ({
    label: item.label,
    href: item.href,
    position: item.position,
    visible: item.visible,
  }));

  const { error: insError } = await supabase.from(TABLE).insert(rows);
  if (insError) return { error: insError.message };

  return { error: null };
}

/** Insert a single navigation item at the end of the list. */
export async function addNavItem(
  label = "New Link",
  href = "/",
): Promise<{ data: NavItem | null; error: string | null }> {
  // Compute next position: count existing rows.
  const { data: existing, error: countError } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: false });

  if (countError) return { data: null, error: countError.message };

  const nextPosition = (existing?.length ?? 0);

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      label,
      href,
      position: nextPosition,
      visible: true,
    })
    .select("*")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToNavItem(data as NavItemRow), error: null };
}

/** Delete a single navigation item by id. */
export async function deleteNavItem(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  return { error: error?.message ?? null };
}
