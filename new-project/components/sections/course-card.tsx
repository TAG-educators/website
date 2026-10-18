'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Course } from '@/lib/courses';

type CourseCardProps = {
  course: Course;
  index?: number;
  className?: string;
};

export function CourseCard({ course, className }: CourseCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group', className)}
    >
      <Link href={`/courses/${course.slug}`} className="block h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-premium transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:shadow-premium-lg group-hover:border-[#b472cc]/30">
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'linear-gradient(90deg, transparent, #b472cc, transparent)' }}
          />

          {/* Hover arrow */}
          <div
            className="absolute top-7 right-6 flex h-7 w-7 items-center justify-center rounded-full opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
            style={{ background: 'rgba(107, 47, 120, 0.15)', color: '#b472cc' }}
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Badge + status dot */}
          <div className="mb-4 flex items-center justify-between">
            <span
              className="inline-block rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em]"
              style={{
                color: '#b472cc',
                background: 'rgba(107, 47, 120, 0.1)',
                borderColor: 'rgba(180, 114, 204, 0.2)',
              }}
            >
              {course.levels.length} Levels
            </span>
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          </div>

          {/* Title + subject */}
          <h3 className="text-[1.2rem] font-bold tracking-tight text-foreground">{course.name}</h3>
          <p className="mt-1 text-[0.88rem] text-muted-foreground">{course.topics[0]}</p>

          {/* Description */}
          <p className="mt-3.5 text-[0.92rem] leading-relaxed text-muted-foreground">
            {course.shortDescription}
          </p>

          {/* Bottom */}
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <span className="text-[0.82rem] text-muted-foreground">Small batches</span>
            <span
              className="text-[0.95rem] font-semibold"
              style={{ color: '#d4a0e8' }}
            >
              View Course
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
