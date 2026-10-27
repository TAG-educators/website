'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FAQ } from '@/lib/content';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection, sectionVisibilityClass } from '@/hooks/use-page-sections';
import { useSiteData } from '@/components/providers/site-data-provider';

export function FAQSection() {
  const prefersReducedMotion = useReducedMotion();
  const [apiFaqs, setApiFaqs] = useState<FAQ[]>(useSiteData()?.faqs ?? []);
  const { rawSections } = usePageSections('home');
  const faqSection = findSection(rawSections, 'faq');

  const sectionData = faqSection?.data as
    | { eyebrow?: string; title?: string; items?: Array<{ question: string; answer: string }> }
    | undefined;
  const sectionMeta = { eyebrow: sectionData?.eyebrow, title: sectionData?.title };
  // Inline items from the page builder win; otherwise the FAQs table.
  const inlineFaqs = sectionData?.items?.map((item) => ({ question: item.question, answer: item.answer }));
  const faqs: FAQ[] = inlineFaqs && inlineFaqs.length > 0 ? inlineFaqs : apiFaqs;

  useEffect(() => {
    fetch('/api/faqs').then(r => r.json()).then(data => {
      if (data && data.length > 0) setApiFaqs(data);
    }).catch(() => {});
  }, []);

  const eyebrow = sectionMeta.eyebrow || 'FAQ';
  const title = sectionMeta.title || 'Questions parents usually ask';

  if (faqSection?.hidden || faqs.length === 0) return null;
  const visibilityClass = sectionVisibilityClass(faqSection);

  return (
    <section className={`relative py-20 md:py-28 ${visibilityClass}`.trim()} data-header-theme="dark">
      <FloatingSymbols />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-ocean-light">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-xl border border-border bg-white px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-display text-lg font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
