'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { faculty as localFaculty, type FacultyMember } from '@/lib/faculty';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection, sectionVisibilityClass } from '@/hooks/use-page-sections';

type TeacherGridData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  teacherIds?: string[];
  showAll?: boolean;
};

export function ResultsSection() {
  const prefersReducedMotion = useReducedMotion();
  const { rawSections } = usePageSections('home');
  const gridSection = findSection(rawSections, 'teacherGrid');
  const gridData = gridSection?.data as TeacherGridData | undefined;

  const [faculty, setFaculty] = useState<FacultyMember[]>(localFaculty);

  useEffect(() => {
    fetch('/api/faculty').then(r => r.json()).then(data => {
      if (data && data.length > 0) setFaculty(data);
    }).catch(() => {});
  }, []);

  // Filter by the CMS teacherGrid's explicit teacherIds unless showAll is set.
  // The public faculty API returns slug-based data, while the CMS stores UUIDs,
  // so fall back to showing all when the ID match yields nothing.
  let previewFaculty = faculty;
  if (gridData?.teacherIds && gridData.teacherIds.length > 0 && !gridData.showAll) {
    const ids = gridData.teacherIds;
    const matched = faculty.filter((m) => ids.includes(m.slug) || ids.includes((m as any).id));
    if (matched.length > 0) previewFaculty = matched;
  }
  previewFaculty = previewFaculty.slice(0, 3);

  if (gridSection?.hidden) return null;
  const visibilityClass = sectionVisibilityClass(gridSection);

  const eyebrow = gridData?.eyebrow || 'Faculty';
  const title = gridData?.title || 'Meet Your Educators';

  return (
    <section className={`relative py-16 pb-8 md:py-28 ${visibilityClass}`.trim()} data-header-theme="dark">
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
          {previewFaculty.map((member, i) => (
            <motion.div
              key={member.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/faculty/${member.slug}`} className="group block h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:shadow-premium-lg group-hover:border-[#b472cc]/30">
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg, transparent, #b472cc, transparent)' }}
                  />

                  {/* Name + subjects */}
                  <h3 className="text-[1.05rem] font-bold tracking-tight text-foreground">{member.name}</h3>
                  <p
                    className="mt-1 text-[0.85rem] font-medium"
                    style={{ color: '#b472cc' }}
                  >
                    {member.subjects.join(' · ')} · O Level · A Level
                  </p>

                  {/* Bio */}
                  <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>

                  {/* View Profile link */}
                  <span
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-medium transition-all group-hover:gap-2.5"
                    style={{ color: '#b472cc' }}
                  >
                    View Profile
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
          >
            View All Faculty
          </Link>
        </div>
      </div>
    </section>
  );
}
