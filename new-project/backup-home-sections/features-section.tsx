'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { features } from '@/lib/content';
import { IconBlock } from './icon-block';

export function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-muted/30 py-20 md:py-28">
      <div className="absolute inset-0 bg-wave-pattern" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-ocean">
            What You Get
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Not just a video call
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            A full loop of practice, feedback and support around every session   designed to
            keep students moving forward between classes.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <IconBlock
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
