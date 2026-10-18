'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IconBlock } from './icon-block';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection, sectionVisibilityClass, type SectionData } from '@/hooks/use-page-sections';
import { features as localFeatures, type Feature } from '@/lib/content';

type CardGridData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  cards?: Array<{ icon?: string; title: string; description: string; href?: string }>;
  columns?: string;
};

export function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();
  const { rawSections } = usePageSections('home');
  const cardGridSection = findSection(rawSections, 'cardGrid');

  const [features, setFeatures] = useState<Feature[]>(localFeatures);
  const [sectionMeta, setSectionMeta] = useState<{
    eyebrow?: string;
    title?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (cardGridSection?.data) {
      const data = cardGridSection.data as CardGridData;
      if (data.cards && data.cards.length > 0) {
        setFeatures(
          data.cards.map((c) => ({
            title: c.title,
            description: c.description,
            icon: c.icon || 'Sparkles',
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

  const eyebrow = sectionMeta.eyebrow || 'What You Get';
  const title = sectionMeta.title || 'Not just a video call';
  const description = sectionMeta.description || 'A full loop of practice, feedback and support around every session   designed to keep students moving forward between classes.';

  if (cardGridSection?.hidden) return null;
  const visibilityClass = sectionVisibilityClass(cardGridSection);

  return (
    <section className={`relative pb-20 md:pb-28 ${visibilityClass}`.trim()} data-header-theme="dark">
      <FloatingSymbols />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <IconBlock
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variant="dark"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
