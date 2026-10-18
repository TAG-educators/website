"use client";

import { PageLayout } from "@/components/sections/page-layout";
import { PageHeader } from "@/components/sections/page-header";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function TermsPage() {
  const { settings } = useSiteSettings();

  const fullName = settings?.siteName || "The Ark Global Educators";
  const whatsappDisplay = settings?.phone || "+92 316 216 5779";
  const email = settings?.email || "info@tageducators.com";

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms and conditions for using TAG Educators services."
      />
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none">
            <h2 className="font-display text-2xl font-bold text-foreground">1. Services</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              TAG Educators ({fullName}) provides online tutoring services for Cambridge
              O Level, A Level and IGCSE students in small, tutor-led batches. Sessions are delivered
              live online.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">2. Registration</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              By registering for a course, you agree to provide accurate and complete information.
              Registration does not guarantee a specific batch time   we will contact you to confirm
              scheduling and availability.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">3. Session Conduct</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Students are expected to attend sessions on time and participate respectfully. Recorded
              sessions are provided for rewatching and are for the student&apos;s personal use only.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">4. No Payment Required at Registration</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Course registration through our website does not require online payment. Fees and
              payment arrangements are handled separately after registration is confirmed.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">5. Intellectual Property</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              All course materials, recorded sessions, and resources provided by TAG Educators are
              the intellectual property of TAG Educators and may not be redistributed or shared
              without written permission.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">6. Changes to Terms</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              We reserve the right to update these terms at any time. Continued use of our services
              after changes constitutes acceptance of the updated terms.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-foreground">7. Contact</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              For questions about these Terms &amp; Conditions, please contact us via WhatsApp at {whatsappDisplay} or by email at {email}.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
