'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  variant?: 'dark' | 'light';
  backgroundContent?: ReactNode;
  flushBottom?: boolean;
  bottomContent?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  variant = 'dark',
  backgroundContent,
  flushBottom = false,
  bottomContent,
}: PageHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDark = variant === 'dark';

  return (
    <section
      className={`relative overflow-hidden ${isDark ? 'bg-ocean-deeper' : 'bg-muted/30'} pt-32 ${flushBottom ? 'pb-0 md:pb-0' : 'pb-12 md:pb-16'} md:pt-40`}
      data-header-theme={isDark ? 'dark' : 'light'}
    >
      {isDark && (
        <>
          {backgroundContent}
        </>
      )}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 15 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-sm font-semibold uppercase tracking-[0.15em] ${isDark ? 'text-ocean-light' : 'text-ocean'}`}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance ${isDark ? 'text-white' : 'text-foreground'}`}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
        >
          {description}
        </motion.p>
      </div>
      {bottomContent}
    </section>
  );
}
