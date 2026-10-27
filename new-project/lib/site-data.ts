import { supabase } from './supabase';
import { getCourses, getFaculty, getFaqs, getSiteSettings, getTestimonialRecords } from './supabase-data';
import type { SiteData } from '@/components/providers/site-data-provider';

// Pages whose admin-built sections the client components read via usePageSections().
const PAGE_SLUGS = ['home', 'about', 'courses', 'faculty', 'contact', 'privacy', 'terms', 'cart', 'resources'];

async function getPages(): Promise<SiteData['pages']> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase.from('pages').select('slug, sections').in('slug', PAGE_SLUGS);
    if (error || !data) return {};
    const pages: SiteData['pages'] = {};
    for (const row of data as { slug: string; sections: unknown }[]) {
      pages[row.slug] = Array.isArray(row.sections) ? (row.sections as SiteData['pages'][string]) : [];
    }
    return pages;
  } catch {
    return {};
  }
}

async function getNavigation(): Promise<SiteData['navigation']> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('label, href')
      .eq('visible', true)
      .order('position');
    if (error || !data) return [];
    return data.map((n: any) => ({ href: n.href, label: n.label }));
  } catch {
    return [];
  }
}

export async function getSiteData(): Promise<SiteData> {
  const [pages, settings, navigation, courses, faculty, faqs, testimonials] = await Promise.all([
    getPages(),
    getSiteSettings(),
    getNavigation(),
    getCourses(),
    getFaculty(),
    getFaqs(),
    getTestimonialRecords(),
  ]);
  return { pages, settings, navigation, courses, faculty, faqs, testimonials };
}
