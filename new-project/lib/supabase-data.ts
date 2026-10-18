// ============================================================
// TAG Public Website — Supabase Data Layer
// Fetches data from Supabase (managed by admin panel).
// Falls back to local static data if Supabase is unavailable
// or returns no results.
// ============================================================

import { supabase } from './supabase';
import { courses as localCourses, type Course } from './courses';
import { faculty as localFaculty, type FacultyMember } from './faculty';
import { testimonials as localTestimonials, type Testimonial } from './testimonials';
import { faqs as localFaqs, type FAQ } from './content';
import { courseResources as localResources, type CourseResources } from './resources-data';

// ---------- Courses ----------
export async function getCourses(): Promise<Course[]> {
  if (!supabase) return localCourses;
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('title');
    if (error) return localCourses;
    if (!data) return localCourses;

    return data.map((row: any) => {
      // Find matching local course for fallback values
      const local = localCourses.find((c) => c.slug === row.slug);

      return {
        slug: row.slug,
        name: row.title || local?.name || row.slug,
        shortDescription: row.short_description || local?.shortDescription || '',
        longDescription: row.long_description || local?.longDescription || '',
        levels: row.levels?.length ? row.levels : local?.levels ?? ['O Level/IGCSE', 'AS Level', 'A2 Level'],
        subLevels: local?.subLevels, // Sub-levels managed in public site for now
        icon: row.icon || local?.icon || 'BookOpen',
        imageQuery: row.image_query || local?.imageQuery || '',
        category: row.category || local?.category || 'Sciences',
        topics: row.topics?.length ? row.topics : local?.topics ?? [],
        whatYouWillLearn: row.what_you_will_learn?.length ? row.what_you_will_learn : local?.whatYouWillLearn ?? [],
        benefits: row.benefits?.length ? row.benefits : local?.benefits ?? [],
        originalPrice: Number(row.original_price) > 0 ? Number(row.original_price) : (local?.originalPrice ?? 0),
        price: Number(row.price) > 0 ? Number(row.price) : (local?.price ?? 0),
      };
    });
  } catch {
    return localCourses;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const all = await getCourses();
  return all.find((c) => c.slug === slug) ?? null;
}

// ---------- Faculty ----------
export async function getFaculty(): Promise<FacultyMember[]> {
  if (!supabase) return localFaculty;
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    if (error) return localFaculty;
    if (!data) return localFaculty;

    return data.map((row: any) => {
      // Find matching local faculty for fallback values
      const local = localFaculty.find((f) => f.slug === row.slug);

      return {
        slug: row.slug,
        name: row.name || local?.name || row.slug,
        role: row.role || local?.role || 'Tutor',
        subjects: row.subjects?.length ? row.subjects : local?.subjects ?? [],
        bio: row.bio || local?.bio || '',
        qualifications: row.qualifications?.length ? row.qualifications : local?.qualifications ?? [],
        cambridgeCertified: row.cambridge_certified ?? local?.cambridgeCertified ?? false,
        imageQuery: row.image_query || local?.imageQuery || '',
        imageSrc: row.photo || local?.imageSrc || undefined,
        experience: row.experience || local?.experience || '',
        expertise: row.expertise?.length ? row.expertise : local?.expertise ?? [],
        badges: row.badges?.length ? row.badges : local?.badges ?? [],
        stats: row.stats?.length ? row.stats : local?.stats ?? [],
      };
    });
  } catch {
    return localFaculty;
  }
}

export async function getFacultyBySlug(slug: string): Promise<FacultyMember | null> {
  const all = await getFaculty();
  return all.find((f) => f.slug === slug) ?? null;
}

// ---------- Testimonials ----------
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return localTestimonials;
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('student_name');
    if (error) return localTestimonials;
    if (!data) return localTestimonials;

    return data.map((row: any) => ({
      quote: row.quote ?? '',
      name: row.student_name ?? '',
      course: row.course ?? '',
    }));
  } catch {
    return localTestimonials;
  }
}

// ---------- FAQs ----------
export async function getFaqs(): Promise<FAQ[]> {
  if (!supabase) return localFaqs;
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order');
    if (error) return localFaqs;
    if (!data) return localFaqs;

    return data.map((row: any) => ({
      question: row.question ?? '',
      answer: row.answer ?? '',
    }));
  } catch {
    return localFaqs;
  }
}

// ---------- Resources ----------
export async function getCourseResources(): Promise<CourseResources[]> {
  if (!supabase) return localResources;
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('subject');
    if (error) return localResources;
    if (!data) return localResources;

    // Group resources by subject → level → topic → PDFs
    const grouped: Record<string, CourseResources> = {};

    for (const row of data) {
      const subjectSlug = (row.subject ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!grouped[subjectSlug]) {
        grouped[subjectSlug] = {
          slug: subjectSlug,
          name: row.subject ?? 'Unknown',
          icon: row.icon ?? 'FileText',
          levels: [],
        };
      }

      const levelName = row.level ?? 'O Level';
      let level = grouped[subjectSlug].levels.find((l) => l.level === levelName);
      if (!level) {
        level = { level: levelName, topics: [] };
        grouped[subjectSlug].levels.push(level);
      }

      const topicName = row.topic ?? 'General';
      let topic = level.topics.find((t) => t.topic === topicName);
      if (!topic) {
        topic = { topic: topicName, pdfs: [] };
        level.topics.push(topic);
      }

      if (row.url) {
        topic.pdfs.push({
          title: row.title,
          url: row.url,
          description: row.excerpt ?? '',
        });
      }
    }

    return Object.values(grouped);
  } catch {
    return localResources;
  }
}

// ---------- Site Settings ----------
export async function getSiteSettings() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error || !data) return null;
    return {
      siteName: data.site_name,
      tagline: data.tagline,
      description: data.description,
      email: data.email,
      phone: data.phone,
      address: data.address,
      instagram: data.instagram,
      facebook: data.facebook,
      youtube: data.youtube,
      domain: data.domain,
      font: data.font ?? 'Inter',
    };
  } catch {
    return null;
  }
}
