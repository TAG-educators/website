'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IconBlock } from './icon-block';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSectionByIndex, sectionVisibilityClass, type SectionData } from '@/hooks/use-page-sections';
import { whyItems as localWhyItems, type WhyItem } from '@/lib/content';

type CardGridData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  cards?: Array<{ icon?: string; title: string; description: string; href?: string }>;
  columns?: string;
};

export function WhyTagSection() {
  const prefersReducedMotion = useReducedMotion();
  const { rawSections } = usePageSections('home');
  // Why TAG is the second cardGrid block on the home page
  const cardGridSection = findSectionByIndex(rawSections, 'cardGrid', 1);

  const [items, setItems] = useState<WhyItem[]>(localWhyItems);
  const [sectionMeta, setSectionMeta] = useState<{
    eyebrow?: string;
    title?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (cardGridSection?.data) {
      const data = cardGridSection.data as CardGridData;
      if (data.cards && data.cards.length > 0) {
        setItems(
          data.cards.map((c) => ({
            title: c.title,
            description: c.description,
            icon: c.icon || 'Award',
          }))
        );
      }
      setSectionMeta({
        eyebrow: data.eyebrow,
        title: data.title,
        description: data.description,
      });
    }
  }, [cardGridSection]);

  const eyebrow = sectionMeta.eyebrow || 'The TAG Advantage';
  const title = sectionMeta.title || 'Why Learn With TAG Educators?';
  const description = sectionMeta.description || 'We are not a tutoring marketplace. We are a focused team of subject specialists who have been through these exact exams   and know how to get students through them too.';

  if (cardGridSection?.hidden) return null;
  const visibilityClass = sectionVisibilityClass(cardGridSection);

  return (
    <section className={`relative py-16 pb-8 md:py-28 ${visibilityClass}`.trim()} data-header-theme="dark">
      <FloatingSymbols />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-ocean-light">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70 text-pretty">
            {description}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <IconBlock
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              variant="dark"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
