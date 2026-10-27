'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FacultyMember } from '@/lib/faculty';

type FacultyCardProps = {
  member: FacultyMember;
  className?: string;
};

export function FacultyCard({ member, className }: FacultyCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group', className)}
    >
      <Link href={`/faculty/${member.slug}`} className="block h-full">
        <div className="faculty-card-inner relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-premium">
          {/* Top accent line */}
          <div
            className="faculty-accent-line absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #b472cc, transparent)' }}
          />
          {/* Side glow lines */}
          <div className="faculty-glow-left" />
          <div className="faculty-glow-right" />

          {/* Faculty photo */}
          <div className="faculty-photo group/photo relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
            {member.imageSrc ? (
              <Image
                src={member.imageSrc}
                alt={`${member.name} profile photo`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover grayscale transition-all duration-700 ease-out group-hover/photo:grayscale-0 group-hover/photo:scale-105"
              />
            ) : (
              <svg viewBox="0 0 100 100" fill="none" className="h-[40%] w-[40%] opacity-60" style={{ color: '#b472cc' }}>
                <circle cx="50" cy="38" r="18" stroke="currentColor" strokeWidth="2" />
                <path d="M18 90c0-18 14-30 32-30s32 12 32 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>

          {/* Name */}
          <h3 className="text-[1.05rem] font-bold tracking-tight text-foreground">{member.name}</h3>

          {/* Subjects */}
          <p
            className="mt-1 text-[0.85rem] font-medium"
            style={{ color: '#b472cc' }}
          >
            {member.subjects.join(' · ')} · O Level · A Level
          </p>

          {/* Bio */}
          <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground line-clamp-3">
            {member.bio}
          </p>

          {/* Badge tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {member.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em]"
                style={{
                  color: '#b472cc',
                  background: 'rgba(107, 47, 120, 0.1)',
                  borderColor: 'rgba(180, 114, 204, 0.2)',
                }}
              >
                {subject}
              </span>
            ))}
          </div>

          {/* View Profile link */}
          <span
            className="faculty-link mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-medium"
            style={{ color: '#b472cc' }}
          >
            View Profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// Grey placeholder shown while the real teachers load, so no wrong content flashes.
export function FacultyCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col rounded-2xl border border-border bg-white p-5 shadow-premium" aria-hidden="true">
      <div className="mb-4 aspect-square w-full rounded-2xl bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
      <div className="mt-4 h-3 w-full rounded bg-muted" />
      <div className="mt-2 h-3 w-5/6 rounded bg-muted" />
    </div>
  );
}
