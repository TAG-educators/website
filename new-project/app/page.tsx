import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/sections/page-layout';
import { Hero } from '@/components/sections/hero';
import { TrustSection } from '@/components/sections/trust-section';

const FeaturesSection = dynamic(() => import('@/components/sections/features-section').then(m => ({ default: m.FeaturesSection })));
const CoursesPreviewSection = dynamic(() => import('@/components/sections/courses-preview-section').then(m => ({ default: m.CoursesPreviewSection })));
const WhyTagSection = dynamic(() => import('@/components/sections/why-tag-section').then(m => ({ default: m.WhyTagSection })));
const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials-section').then(m => ({ default: m.TestimonialsSection })));
const ResultsSection = dynamic(() => import('@/components/sections/results-section').then(m => ({ default: m.ResultsSection })));
const StepsSection = dynamic(() => import('@/components/sections/steps-section').then(m => ({ default: m.StepsSection })));
const FAQSection = dynamic(() => import('@/components/sections/faq-section').then(m => ({ default: m.FAQSection })));
const CTASection = dynamic(() => import('@/components/sections/cta-section').then(m => ({ default: m.CTASection })));

export default function HomePage() {
  return (
    <PageLayout>
      <div className="relative bg-ocean-deeper" data-header-theme="dark">
        <Hero />
        <TrustSection />
        <FeaturesSection />
        <CoursesPreviewSection />
        <WhyTagSection />
        <TestimonialsSection />
        <ResultsSection />
        <StepsSection />
        <FAQSection />
        <CTASection showTopFade={false} showSymbols />
      </div>
    </PageLayout>
  );
}
