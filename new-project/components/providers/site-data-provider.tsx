'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SectionData } from '@/hooks/use-page-sections';
import type { SiteSettingsData } from '@/hooks/use-site-settings';
import type { Course } from '@/lib/courses';
import type { FacultyMember } from '@/lib/faculty';
import type { FAQ } from '@/lib/content';
import type { TestimonialRecord } from '@/lib/supabase-data';

// Admin-panel data loaded on the server for the current request, so the very first
// paint already shows real content instead of built-in defaults.
export type SiteData = {
  pages: Record<string, SectionData[]>;
  settings: SiteSettingsData | null;
  navigation: { href: string; label: string }[];
  courses: Course[];
  faculty: FacultyMember[];
  faqs: FAQ[];
  testimonials: TestimonialRecord[];
};

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({ value, children }: { value: SiteData; children: ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteData | null {
  return useContext(SiteDataContext);
}
