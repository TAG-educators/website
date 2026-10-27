'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Course } from '@/lib/courses';
import { useSiteData } from '@/components/providers/site-data-provider';
import { CourseCard } from './course-card';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection, sectionVisibilityClass } from '@/hooks/use-page-sections';

type CourseGridData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  courseIds?: string[];
  showAll?: boolean;
};

export function CoursesPreviewSection() {
  const prefersReducedMotion = useReducedMotion();
  const { rawSections } = usePageSections('home');
  const gridSection = findSection(rawSections, 'courseGrid');
  const gridData = gridSection?.data as CourseGridData | undefined;

  const [courses, setCourses] = useState<Course[]>(useSiteData()?.courses ?? []);

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(data => {
      if (data && data.length > 0) setCourses(data);
    }).catch(() => {});
  }, []);

  // Filter by the CMS courseGrid's explicit courseIds unless showAll is set.
  // The public courses API returns slug-based data, while the CMS stores UUIDs,
  // so fall back to showing all when the ID match yields nothing.
  let previewCourses = courses;
  if (gridData?.courseIds && gridData.courseIds.length > 0 && !gridData.showAll) {
    const ids = gridData.courseIds;
    const matched = courses.filter((c) => ids.includes(c.slug) || ids.includes((c as any).id));
    if (matched.length > 0) previewCourses = matched;
  }
  previewCourses = previewCourses.slice(0, 3);

  if (gridSection?.hidden) return null;
  const visibilityClass = sectionVisibilityClass(gridSection);

  const eyebrow = gridData?.eyebrow || 'Explore';
  const title = gridData?.title || 'Explore Our Courses';

  return (
    <section className={`relative py-20 md:py-28 ${visibilityClass}`.trim()} data-header-theme="dark">
      <FloatingSymbols />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p
            className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: '#b472cc' }}
          >
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
          {gridData?.description && (
            <p className="mt-3 text-[1.05rem] leading-relaxed text-white/70 text-pretty">
              {gridData.description}
            </p>
          )}
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
