'use client';

import { useState, useEffect } from 'react';

export type SectionData = {
  id: string;
  type: string;
  hidden: boolean;
  desktopVisible?: boolean;
  mobileVisible?: boolean;
  data: Record<string, any>;
};

/**
 * Fetches page sections from the admin (via /api/page-sections?slug=...).
 * - `sections`: filtered to only non-hidden sections (for data lookups).
 * - `rawSections`: the full list including hidden + visibility flags, so
 *   components can decide whether to render at all.
 */
export function usePageSections(slug: string = 'home') {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [rawSections, setRawSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview');
    const qs = `slug=${encodeURIComponent(slug)}${preview ? `&preview=${encodeURIComponent(preview)}` : ''}`;
    fetch(`/api/page-sections?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRawSections(data);
          setSections(data.filter((s: SectionData) => !s.hidden));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  return { sections, rawSections, loading };
}

/**
 * Finds a single section by type from the page sections.
 */
export function findSection(sections: SectionData[], type: string): SectionData | undefined {
  return sections.find((s) => s.type === type);
}

/**
 * Finds the Nth section of a given type (0-indexed).
 * Useful when multiple blocks of the same type exist on a page.
 */
export function findSectionByIndex(sections: SectionData[], type: string, index: number = 0): SectionData | undefined {
  const matching = sections.filter((s) => s.type === type);
  return matching[index];
}

/**
 * Returns the CSS class(es) that hide a section on desktop / mobile
 * based on the admin's "Show on desktop" / "Show on mobile" toggles.
 * Callers should also early-return null when `raw?.hidden` is true.
 */
export function sectionVisibilityClass(raw?: SectionData): string {
  if (!raw) return '';
  const classes: string[] = [];
  if (raw.desktopVisible === false) classes.push('cms-hidden-desktop');
  if (raw.mobileVisible === false) classes.push('cms-hidden-mobile');
  return classes.join(' ');
}
