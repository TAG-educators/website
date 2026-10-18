'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { siteConfig } from '@/lib/site-config';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection, sectionVisibilityClass } from '@/hooks/use-page-sections';

type CTASectionProps = {
  variant?: 'dark' | 'light';
  boxVariant?: 'dark' | 'light';
  showTopFade?: boolean;
  showSymbols?: boolean;
};

type CTAData = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  primaryCta?: { label?: string; href?: string };
  secondaryCta?: { label?: string; href?: string };
};

export function CTASection({
  variant = 'dark',
  boxVariant,
  showTopFade = true,
  showSymbols = false,
}: CTASectionProps) {
  const isLight = variant === 'light';
  const isBoxLight = (boxVariant ?? variant) === 'light';
  const prefersReducedMotion = useReducedMotion();
  const { rawSections } = usePageSections('home');
  const ctaSection = findSection(rawSections, 'cta');

  const [ctaData, setCtaData] = useState<CTAData | null>(null);

  useEffect(() => {
    if (ctaSection?.data) {
      setCtaData(ctaSection.data as CTAData);
    }
  }, [ctaSection]);

  const eyebrow = ctaData?.eyebrow || 'Get Started';
  const heading = ctaData?.heading || 'Ready to Start Learning?';
  const description = ctaData?.description || 'Explore our courses and find the right learning path for you. Your journey to A* starts here.';
  const primaryCta = ctaData?.primaryCta;
  const secondaryCta = ctaData?.secondaryCta;

  if (ctaSection?.hidden) return null;
  const visibilityClass = sectionVisibilityClass(ctaSection);

  return (
    <section
      className={`relative ${showTopFade ? 'overflow-hidden py-20 md:py-28 ' + (isLight ? 'bg-white' : 'bg-ocean-deeper') : 'overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-ocean-deeper'} ${visibilityClass}`.trim()}
      data-header-theme={isLight ? 'light' : 'dark'}
    >
      {/* Top fade */}
      {showTopFade && (
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 z-10"
          style={{
            height: '120px',
            background: isLight
              ? 'linear-gradient(to bottom, #faf8fb 0%, rgba(255,255,255,0.5) 50%, transparent 100%)'
              : 'linear-gradient(to bottom, #faf8fb 0%, rgba(21, 12, 27, 0.05) 50%, transparent 100%)',
          }}
        />
      )}
      {showSymbols && <FloatingSymbols />}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-4xl overflow-hidden rounded-3xl px-8 py-16 text-center md:px-12 md:py-16"
          style={{
            background: isBoxLight
              ? 'linear-gradient(180deg, #ffffff, #faf8fb)'
              : 'linear-gradient(180deg, #1e1328, #221630)',
            border: isBoxLight ? '1px solid hsl(289 32% 91%)' : 'none',
            boxShadow: isBoxLight ? '0 8px 40px -12px rgba(107,47,120,0.12)' : 'none',
          }}
        >
          {/* Top glow line — only on light variant */}
          {isBoxLight && (
            <div
              className="absolute top-0 left-1/2 h-0.5 -translate-x-1/2"
              style={{
                width: '60%',
                background: 'linear-gradient(90deg, transparent, #b472cc, transparent)',
              }}
            />
          )}

          {/* Radial glow */}
          <div
            className="pointer-events-none absolute -top-1/2 left-1/2 -translate-x-1/2"
            style={{
              width: '500px',
              height: '500px',
              background: isBoxLight
                ? 'radial-gradient(circle, rgba(168, 85, 196, 0.06), transparent 60%)'
                : 'radial-gradient(circle, rgba(168, 85, 196, 0.1), transparent 60%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Content */}
          <div className="relative">
            <p
              className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
              style={{ color: '#b472cc' }}
            >
              {eyebrow}
            </p>
            <h2
              className={`mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance ${isBoxLight ? 'text-foreground' : 'text-white'}`}
            >
              {heading}
            </h2>
            <p
              className={`mx-auto mt-3.5 max-w-2xl text-[1.05rem] leading-relaxed text-pretty ${isBoxLight ? 'text-muted-foreground' : 'text-[#a89fb5]'}`}
            >
              {description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={primaryCta?.href || '/courses'}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6b2f78, #a855c4)' }}
              >
                {primaryCta?.label || 'Explore Courses'}
              </Link>
              <a
                href={secondaryCta?.href || siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isBoxLight
                    ? 'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ocean/20 bg-ocean/5 px-7 text-base font-semibold text-foreground transition-all hover:bg-ocean/10 hover:border-ocean/40 active:scale-95'
                    : 'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/4 px-7 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/8 hover:border-[#b472cc] active:scale-95'
                }
              >
                {secondaryCta?.label || 'Contact Us'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
