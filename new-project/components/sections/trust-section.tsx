'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection, sectionVisibilityClass } from '@/hooks/use-page-sections';

const defaultTrustItems = [
  { value: '8', label: 'Subjects Taught' },
  { value: '3', label: 'Levels   O, A & IGCSE' },
  { value: '2', label: 'Cambridge-Certified Tutors' },
  { value: '100%', label: 'Exam-Sat Faculty' },
];

type StatisticsData = {
  eyebrow?: string;
  title?: string;
  stats?: Array<{ value: string; label: string }>;
};

export function TrustSection() {
  const prefersReducedMotion = useReducedMotion();
  const { rawSections } = usePageSections('home');
  const statsSection = findSection(rawSections, 'statistics');

  const statsData = statsSection?.data as StatisticsData | undefined;
  const trustItems =
    statsData?.stats && statsData.stats.length > 0
      ? statsData.stats.map((s) => ({ value: s.value, label: s.label }))
      : defaultTrustItems;

  if (statsSection?.hidden) return null;
  const visibilityClass = sectionVisibilityClass(statsSection);

  return (
    <section className={`relative py-12 md:py-16 ${visibilityClass}`.trim()} data-header-theme="dark">
      <FloatingSymbols density="sparse" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4 lg:gap-12">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2"
            >
              <div
                className="text-4xl font-bold leading-none md:text-5xl text-white"
              >
                {item.value}
              </div>
              <div className="text-sm text-white/70">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
