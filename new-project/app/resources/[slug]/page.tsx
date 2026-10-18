import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Ship, MessageCircle, CalendarDays, Clock } from 'lucide-react';
import { PageLayout } from '@/components/sections/page-layout';
import { resources } from '@/lib/resources';
import { siteConfig } from '@/lib/site-config';
import { courses } from '@/lib/courses';

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const resource = resources.find((r) => r.slug === params.slug);
  if (!resource) return { title: 'Resource Not Found' };

  return {
    title: resource.title,
    description: resource.excerpt,
    alternates: { canonical: `/resources/${resource.slug}` },
    openGraph: {
      title: `${resource.title}   TAG Educators`,
      description: resource.excerpt,
    },
  };
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const resource = resources.find((r) => r.slug === params.slug);
  if (!resource) notFound();

  const formattedDate = new Date(resource.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-deeper pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-ocean/20 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            All Resources
          </Link>

          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean/30 px-3 py-1 text-sm font-medium text-white">
              {resource.category}
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl text-balance">
            {resource.title}
          </h1>

          <div className="mt-6 flex items-center gap-5 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {resource.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-muted/20 p-8">
            <p className="text-lg leading-relaxed text-foreground">{resource.excerpt}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold text-foreground">About This Resource</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              This resource is part of TAG Educators&apos; commitment to keeping students learning
              between sessions. Our resources are designed to complement our small-batch, tutor-led
              sessions   providing structured practice and guidance aligned with the Cambridge
              syllabus.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              To access the full resource or learn more about how it fits into our courses, reach
              out to us on WhatsApp or explore our available subjects.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-2xl border border-ocean/20 bg-ocean/5 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean text-white">
                <Ship className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Want the full resource?
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Message us on WhatsApp to get access, or browse our courses to start learning.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ocean px-5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-ocean-dark active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                Message on WhatsApp
              </a>
              <Link
                href="/courses"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-foreground transition-all hover:border-ocean hover:text-ocean active:scale-95"
              >
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
