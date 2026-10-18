'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { faculty } from '@/lib/faculty';

export function ResultsSection() {
  const prefersReducedMotion = useReducedMotion();
  const previewFaculty = faculty.slice(0, 3);

  return (
    <section className="relative bg-[#faf8fb] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p
            className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: '#b472cc' }}
          >
            Faculty
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Meet Your Educators
          </h2>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground text-pretty">
            Every tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college. Click any teacher to view their full profile.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewFaculty.map((member, i) => (
            <motion.div
              key={member.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/faculty/${member.slug}`} className="group block h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-premium transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-premium-lg group-hover:border-[#b472cc]/30">
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg, transparent, #b472cc, transparent)' }}
                  />

                  {/* Name + subjects */}
                  <h3 className="text-[1.05rem] font-bold tracking-tight text-foreground">{member.name}</h3>
                  <p
                    className="mt-1 text-[0.85rem] font-medium"
                    style={{ color: '#b472cc' }}
                  >
                    {member.subjects.join(' · ')} · O Level · A Level
                  </p>

                  {/* Bio */}
                  <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>

                  {/* View Profile link */}
                  <span
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-medium transition-all group-hover:gap-2.5"
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
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
          >
            View All Faculty
          </Link>
        </div>
      </div>
    </section>
  );
}
