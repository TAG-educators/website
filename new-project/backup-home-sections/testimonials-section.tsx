'use client';

import { motion, useReducedMotion } from 'framer-motion';

const reelItems = [
  {
    name: 'Ayesha M.',
    subject: 'Physics A*   2024',
    poster: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop',
  },
  {
    name: 'Hassan R.',
    subject: 'Chemistry A   2024',
    poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
  },
  {
    name: 'Mariam K.',
    subject: 'Mathematics A*   2023',
    poster: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop',
  },
  {
    name: 'Bilal S.',
    subject: 'Biology A   2024',
    poster: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=700&fit=crop',
  },
  {
    name: 'Zainab F.',
    subject: 'Business A*   2023',
    poster: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=700&fit=crop',
  },
  {
    name: 'Omar T.',
    subject: 'CS A   2024',
    poster: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&h=700&fit=crop',
  },
];

export function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#faf8fb] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p
            className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: '#b472cc' }}
          >
            Student Voices
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Hear It From Our Students
          </h2>
        </motion.div>
      </div>

      <div
        className="reel-scroll mt-12 flex gap-4 overflow-x-auto pb-2"
        style={{
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          padding: '0 max(24px, calc((100vw - 1200px) / 2 + 24px))',
        }}
      >
        {reelItems.map((item, i) => (
          <motion.div
            key={item.name}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-none overflow-hidden rounded-2xl border border-border shadow-premium"
            style={{
              width: '200px',
              height: '356px',
              scrollSnapAlign: 'start',
              backgroundImage: `url(${item.poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                padding: '40px 16px 14px',
                background: 'linear-gradient(to top, rgba(21, 12, 27, 0.92), transparent)',
              }}
            >
              <p className="text-[0.92rem] font-semibold text-white">{item.name}</p>
              <p className="text-[0.78rem]" style={{ color: '#d4a0e8' }}>
                {item.subject}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
