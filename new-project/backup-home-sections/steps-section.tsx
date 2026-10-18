'use client';

import { motion, useReducedMotion } from 'framer-motion';

const testimonialItems = [
  {
    quote:
      'I finished my Physics course two months before the exams... right now I\'m doing past papers and they\'re a breeze in all honesty.',
    name: 'Physics Student',
    result: 'A*',
    course: 'Physics O Level',
  },
  {
    quote:
      'I was struggling with time management, but TAG gave me the exact examiner cheat codes to fast-track my revision and master the papers.',
    name: 'Revision Student',
    result: 'A',
    course: 'Multiple Subjects',
  },
  {
    quote: 'From failing mocks to A* confidence. Exam anxiety is gone.',
    name: 'A Level Student',
    result: 'A*',
    course: 'A Level',
  },
];

export function StepsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[#faf8fb] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p
            className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: '#b472cc' }}
          >
            Student Stories
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Real Students, Real Results
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:border-[#b472cc]/30">
                {/* Quote mark decoration */}
                <div
                  className="pointer-events-none absolute right-5 top-3 font-serif text-[4.5rem] leading-none opacity-15"
                  style={{
                    background: 'linear-gradient(135deg, #b472cc, #d4a0e8)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  &quot;
                </div>

                {/* Quote */}
                <p className="relative z-10 mb-5 text-[1.08rem] italic leading-relaxed text-foreground">
                  {item.quote}
                </p>

                {/* Footer */}
                <div className="mt-auto border-t border-border pt-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-serif text-[1rem] font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="rounded-full bg-green-400/12 px-2.5 py-0.5 text-[0.88rem] font-semibold text-green-600">
                      {item.result}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[0.85rem] text-muted-foreground">{item.course}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
