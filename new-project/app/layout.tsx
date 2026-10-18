import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/components/providers/cart-provider';
import { CurrencyProvider } from '@/components/providers/currency-provider';
import { FontProvider } from '@/components/providers/font-provider';
import { PageTransition } from '@/components/sections/page-transition';

export const metadata: Metadata = {
  metadataBase: new URL('https://tageducators.com'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  title: {
    default: 'TAG Educators   The Ark Global Educators',
    template: '%s   TAG Educators',
  },
  description:
    'Premium Cambridge O Level, A Level and IGCSE tutoring in small tutor-led batches. Learn from educators who have sat these exact exams. Live online, wherever you are.',
  keywords: [
    'O Level tutoring',
    'A Level tutoring',
    'IGCSE tutoring',
    'Cambridge exams',
    'online tutoring',
    'past papers',
    'TAG Educators',
    'The Ark Global Educators',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tageducators.com',
    siteName: 'TAG Educators',
    title: 'TAG Educators   Less Sinking. More Sailing.',
    description:
      'Premium Cambridge O Level, A Level and IGCSE tutoring in small tutor-led batches. Taught by someone who has already sat this exact exam.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAG Educators   Less Sinking. More Sailing.',
    description:
      'Premium Cambridge O Level, A Level and IGCSE tutoring in small tutor-led batches.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <CartProvider>
          <CurrencyProvider>
            <FontProvider>
              <PageTransition>{children}</PageTransition>
            </FontProvider>
          </CurrencyProvider>
        </CartProvider>
      </body>
    </html>
  );
}
