'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/sections/page-layout';
import { PageHeader } from '@/components/sections/page-header';
import { AnimatedSection } from '@/components/sections/animated-section';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSectionByIndex, sectionVisibilityClass } from '@/hooks/use-page-sections';

const defaultAboutPoints = [
  {
    title: '1. Experienced Tutors Who\'ve Sat These Exams',
    description:
      'Every TAG tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college. Two of our faculty are also formally Cambridge certified. This means insider knowledge of exact exam traps, mark-scheme language, and the specific techniques that earn marks - not just subject knowledge.',
  },
  {
    title: '2. Small Batches, Real Attention',
    description:
      'We keep batches deliberately small and tutor-led. No 40-student Zoom calls. No recorded lectures pretending to be "online learning." Every student gets noticed, gets questions answered, and gets real attention from their tutor throughout the course.',
  },
  {
    title: '3. Built for Any Time Zone',
    description:
      'Sessions run fully online, so scheduling is built around what works for your family - wherever in the world you are. Whether you\'re in Karachi, Dubai, London or Toronto, we\'ll find a slot that works.',
  },
];

const defaultValues = [
  {
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0 M19 8v6M22 11h-6',
    title: 'Expert Faculty',
    description: 'Learn from experienced educators who\'ve sat these exact Cambridge papers.',
  },
  {
    icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
    title: 'Practical Learning',
    description: 'Focus on useful and applicable knowledge, built around real exam technique.',
  },
  {
    icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    title: 'Structured Courses',
    description: 'Clear learning paths for students, mapped to the current syllabus.',
  },
  {
    icon: 'M12 21c-4-3.5-7-7.5-7-11.5A7 7 0 0 1 12 3a7 7 0 0 1 7 6.5C19 13.5 16 17.5 12 21z M12 21V10',
    title: 'Supportive Environment',
    description: 'Small batches designed around students - real attention from your tutor.',
  },
];

type CardGridData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  cards?: Array<{ icon?: string; title: string; description: string; href?: string }>;
};

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion();
  const { sections, rawSections } = usePageSections('about');
  const rawHero = rawSections.find((s) => s.type === 'hero');
  // First cardGrid = "Three Things That Define TAG", second = "What We Stand For"
  const rawCardGrids = rawSections.filter((s) => s.type === 'cardGrid');
  const aboutPointsRaw = rawCardGrids[0];
  const valuesRaw = rawCardGrids[1];

  const [aboutPoints, setAboutPoints] = useState(defaultAboutPoints);
  const [values, setValues] = useState(defaultValues);
  const [pageHeader, setPageHeader] = useState<{
    eyebrow?: string;
    title?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (sections.length === 0) return;

    // First section could be a hero for the page header
    const firstSection = sections[0];
    if (firstSection.type === 'hero' && firstSection.data) {
      const d = firstSection.data as { eyebrow?: string; title?: string; description?: string };
      setPageHeader({
        eyebrow: d.eyebrow,
        title: d.title,
        description: d.description,
      });
    }

    // First cardGrid = about points
    const firstCardGrid = findSectionByIndex(sections, 'cardGrid', 0);
    if (firstCardGrid?.data) {
      const data = firstCardGrid.data as CardGridData;
      if (data.cards && data.cards.length > 0) {
        setAboutPoints(
          data.cards.map((c) => ({
            title: c.title,
            description: c.description,
          }))
        );
      }
    }

    // Second cardGrid = values
    const secondCardGrid = findSectionByIndex(sections, 'cardGrid', 1);
    if (secondCardGrid?.data) {
      const data = secondCardGrid.data as CardGridData;
      if (data.cards && data.cards.length > 0) {
        setValues(
          data.cards.map((c, i) => ({
            icon: defaultValues[i]?.icon || defaultValues[0].icon,
            title: c.title,
            description: c.description,
          }))
        );
      }
    }
  }, [sections]);

  const headerEyebrow = pageHeader.eyebrow || 'About Us';
  const headerTitle = pageHeader.title || 'The Ark Global Educators';
  const headerDescription = pageHeader.description || 'TAG Educators is a small-batch, specialist tutoring platform for Cambridge O Level, A Level and IGCSE students. We match students with tutors who\'ve sat these exact exams - and keep batches small enough that every student still gets real attention.';

  return (
    <PageLayout>
      <div className="bg-ocean-deeper" data-header-theme="dark">
        {!rawHero?.hidden && (
          <div className={sectionVisibilityClass(rawHero)}>
            <PageHeader
              eyebrow={headerEyebrow}
              title={headerTitle}
              description={headerDescription}
              backgroundContent={<FloatingSymbols />}
            />
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
            {/* Three Things That Define TAG */}
            {!aboutPointsRaw?.hidden && (
              <section className={`relative py-20 md:py-28 ${sectionVisibilityClass(aboutPointsRaw)}`.trim()}>
                <FloatingSymbols />
                <div className="relative z-10">
                  <AnimatedSection animation="fade-up" className="mx-auto max-w-2xl text-center">
                    <p
                      className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
                      style={{ color: '#b472cc' }}
                    >
                      What Makes Us Different
                    </p>
                    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
                      Three Things That Define TAG
                    </h2>
                  </AnimatedSection>

                  <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-8">
                    {aboutPoints.map((point, i) => (
                      <AnimatedSection key={point.title} animation="fade-up" delay={i * 0.1}>
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-premium transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-[#b472cc]/20 hover:shadow-premium-lg">
                          <h3 className="text-[1.15rem] font-bold tracking-tight text-foreground">{point.title}</h3>
                          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{point.description}</p>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* What We Stand For */}
            {!valuesRaw?.hidden && (
            <section className={`relative py-20 md:py-28 ${sectionVisibilityClass(valuesRaw)}`.trim()}>
              <FloatingSymbols />
              <div className="relative z-10">
                <AnimatedSection animation="fade-up" className="mx-auto max-w-2xl text-center">
                  <p
                    className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: '#b472cc' }}
                  >
                    Our Values
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
                    What We Stand For
                  </h2>
                </AnimatedSection>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {values.map((value, i) => (
                    <AnimatedSection
                      key={value.title}
                      animation="fade-up"
                      delay={i * 0.1}
                      className="flex flex-col items-center gap-3 px-5 py-8 text-center"
                    >
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          background: '#ffffff',
                          color: '#b472cc',
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                          <path d={value.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h3 className="text-[1.05rem] font-bold tracking-tight text-white">{value.title}</h3>
                      <p className="text-[0.9rem] leading-relaxed text-white/70">{value.description}</p>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </section>
            )}
        </div>
      </div>
    </PageLayout>
  );
}
