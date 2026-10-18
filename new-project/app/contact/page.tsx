"use client";

import { Mail, MessageCircle, Phone, Ship } from "lucide-react";
import { PageLayout } from "@/components/sections/page-layout";
import { PageHeader } from "@/components/sections/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { AnimatedSection } from "@/components/sections/animated-section";
import { siteConfig } from "@/lib/site-config";
import { usePageSections, findSection, sectionVisibilityClass } from "@/hooks/use-page-sections";
import { useSiteSettings } from "@/hooks/use-site-settings";

type HeroData = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function ContactPage() {
  const { sections, rawSections } = usePageSections("contact");
  const heroSection = findSection(sections, "hero");
  const rawHero = rawSections.find((s) => s.type === "hero");
  const heroData = heroSection?.data as HeroData | undefined;
  const { settings } = useSiteSettings();

  const eyebrow = heroData?.eyebrow || "Get In Touch";
  const title = heroData?.title || "Contact Us";
  const description = heroData?.description || "Message us your subject and level on WhatsApp, or fill out the form below. We will help you find the right tutor for your Cambridge O Level, A Level or IGCSE subject.";

  const whatsappUrl = settings?.phone
    ? `https://wa.me/${settings.phone.replace(/[^0-9]/g, "")}`
    : siteConfig.whatsappUrl;
  const whatsappDisplay = settings?.phone || siteConfig.whatsappDisplay;
  const email = settings?.email || siteConfig.email;
  const fullName = settings?.siteName || siteConfig.fullName;
  const tagline = settings?.tagline || siteConfig.tagline;

  return (
    <PageLayout>
      {!rawHero?.hidden && (
        <div className={sectionVisibilityClass(rawHero)}>
          <PageHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </div>
      )}

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact info */}
            <AnimatedSection animation="fade-up" className="lg:col-span-1">
              <h2 className="font-display text-2xl font-bold text-foreground">Reach Us Directly</h2>
              <p className="mt-4 text-base text-muted-foreground">
                Prefer to message us directly? We are one tap away.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-ocean hover:shadow-premium"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean transition-colors group-hover:bg-ocean group-hover:text-white">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-base font-bold text-foreground">WhatsApp</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {whatsappDisplay}
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-ocean hover:shadow-premium"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean transition-colors group-hover:bg-ocean group-hover:text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-base font-bold text-foreground">Email</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">{email}</div>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-base font-bold text-foreground">Sessions</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      Live online, worldwide
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-ocean/20 bg-ocean/5 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean text-white">
                    <Ship className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-base font-bold text-foreground">
                      {fullName}
                    </div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {tagline}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact form */}
            <AnimatedSection animation="fade-up" delay={0.15} className="lg:col-span-2">
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
