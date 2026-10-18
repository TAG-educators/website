import type { Metadata, Viewport } from "next";

/**
 * Pre-paint inline script: if the previous page flagged that we're
 * "entering" (sessionStorage tagEntering), set the tag-arriving class on
 * <html> BEFORE first paint so the arriving page never flashes fully
 * visible before the fade-in transition runs. Mirrors transitions.js.
 * Harmless on admin pages (no transition runs there).
 */
const ARRIVING_SCRIPT = `(function(){try{if(sessionStorage.getItem('tagEntering')){document.documentElement.classList.add('tag-arriving');}}catch(e){})();`;

export const metadata: Metadata = {
  title: "TAG Admin",
  description: "Ark Global Educators - content management",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TAG Admin",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Pre-paint arriving class — must run before first paint */}
        <script dangerouslySetInnerHTML={{ __html: ARRIVING_SCRIPT }} />
        {/* Fonts: Source Serif 4 (serif) + Inter (sans) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
