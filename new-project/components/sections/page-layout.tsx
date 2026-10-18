'use client';

import { Navbar } from '@/components/sections/navbar';
import { Footer } from '@/components/sections/footer';
import { VoyageTracker } from '@/components/sections/voyage-tracker';
import { WhatsAppButton } from '@/components/sections/whatsapp-button';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

export function PageLayout({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <VoyageTracker />
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
