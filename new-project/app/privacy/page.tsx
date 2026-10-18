"use client";

import { PageLayout } from "@/components/sections/page-layout";
import { PageHeader } from "@/components/sections/page-header";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function PrivacyPage() {
  const { settings } = useSiteSettings();

  const email = settings?.email || "info@tageducators.com";
  const whatsappDisplay = settings?.phone || "+92 316 216 5779";

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="How TAG Educators collects, uses and protects your information."
      />
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none">
            <h2 className="font-display text-2xl font-bold text-foreground">1. Information We Collect</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              When you register for a course or contact us through our forms, we collect your name,
              email address, phone number, and any additional information you choose to provide
              (such as preferred timings or subject of interest).
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              We use your information to process course registrations, communicate with you about
              sessions and scheduling, provide progress updates to parents, and respond to your
              enquiries. We do not sell or share your information with third parties.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">3. WhatsApp Communication</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              By contacting us via WhatsApp or providing your phone number, you consent to receiving
              messages related to your tutoring sessions, progress updates, and course information.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">4. Data Retention</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              We retain your information for as long as you are an active student or as necessary to
              provide our services. You may request deletion of your data at any time by contacting
              us at {email}.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">5. Your Rights</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              You have the right to access, correct, or delete your personal information. To exercise
              these rights, please contact us at {email}.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">6. Contact</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us via WhatsApp at {whatsappDisplay} or by email at {email}.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
