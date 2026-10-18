import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/components/providers/cart-provider';
import { CurrencyProvider } from '@/components/providers/currency-provider';
import { FontProvider } from '@/components/providers/font-provider';
import { PageTransition } from '@/components/sections/page-transition';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
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
