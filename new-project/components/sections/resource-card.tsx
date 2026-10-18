'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Resource } from '@/lib/resources';

type ResourceCardProps = {
  resource: Resource;
  className?: string;
};

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const IconComponent = Icons[resource.icon as keyof typeof Icons] as Icons.LucideIcon | undefined;
  const FallbackIcon = Icons.FileText;

  const formattedDate = new Date(resource.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group', className)}
    >
      <Link href={`/resources/${resource.slug}`} className="block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-premium transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:shadow-premium-lg group-hover:border-ocean/30">
          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean/10 text-ocean transition-colors group-hover:bg-ocean group-hover:text-white">
                {IconComponent ? (
                  <IconComponent className="h-6 w-6" strokeWidth={1.8} />
                ) : (
                  <FallbackIcon className="h-6 w-6" strokeWidth={1.8} />
                )}
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {resource.category}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold leading-snug text-foreground group-hover:text-ocean transition-colors">
              {resource.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {resource.excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between pt-5">
              <span className="text-xs text-muted-foreground">
                {formattedDate} · {resource.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean transition-all group-hover:gap-2.5">
                Read More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
