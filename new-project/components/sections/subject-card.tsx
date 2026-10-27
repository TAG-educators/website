'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Course } from '@/lib/courses';
import { useSiteData } from '@/components/providers/site-data-provider';

type SubjectCardProps = {
  course: Course;
  index?: number;
  className?: string;
  initialLevel?: string;
};

export function SubjectCard({ course, className }: SubjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const IconComponent = Icons[course.icon as keyof typeof Icons] as Icons.LucideIcon | undefined;
  const FallbackIcon = Icons.BookOpen;

  const faculty = useSiteData()?.faculty ?? [];
  const tutor = faculty.find((f) => f.subjects.includes(course.name));

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group', className)}
    >
      <div className="subject-card-inner relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-premium">
        {/* Top accent line */}
        <div
          className="subject-accent-line absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #b472cc, transparent)' }}
        />
        {/* Side glow lines */}
        <div className="subject-glow-left" />
        <div className="subject-glow-right" />

        {/* Purple header area */}
        <div
          className="flex items-center justify-center py-8"
          style={{ background: 'linear-gradient(135deg, #6b2f78, #a855c4)' }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-110"
            style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
          >
            {IconComponent ? (
              <IconComponent className="h-7 w-7" strokeWidth={1.5} />
            ) : (
              <FallbackIcon className="h-7 w-7" strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-3 p-7">
          {/* Title */}
          <h3 className="text-[1.2rem] font-bold tracking-tight text-foreground">{course.name}</h3>

          {/* Level pills - static badges, not clickable */}
          <div className="flex flex-wrap gap-1.5">
            {course.levels.map((level) => (
              <span
                key={level}
                className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[0.72rem] font-medium text-muted-foreground"
              >
                {level}
              </span>
            ))}
          </div>

          {/* Teacher tag */}
          {tutor && (
            <Link
              href={`/faculty/${tutor.slug}`}
              className="inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.82rem] font-medium transition-all hover:bg-[rgba(107,47,120,0.2)] hover:border-[#b472cc]/50"
              style={{
                background: 'rgba(107, 47, 120, 0.1)',
                borderColor: 'rgba(180, 114, 204, 0.25)',
                color: '#b472cc',
              }}
            >
              <svg viewBox="0 0 100 100" fill="none" style={{ width: '18px', height: '18px' }}>
                <circle cx="50" cy="38" r="18" stroke="currentColor" strokeWidth="3" />
                <path d="M18 90c0-18 14-30 32-30s32 12 32 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {tutor.name}
            </Link>
          )}

          {/* Description */}
          <p className="text-[0.9rem] leading-relaxed text-muted-foreground">{course.shortDescription}</p>

          {/* Bottom row */}
          <div className="mt-auto flex items-center justify-between gap-2.5 pt-4">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-[0.88rem] font-medium transition-all group-hover:gap-2.5"
              style={{ color: '#b472cc' }}
            >
              View course
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
