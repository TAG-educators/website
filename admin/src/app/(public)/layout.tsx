import type { Metadata } from "next";
import Link from "next/link";
import { fetchVisibleNavItems, type NavItem } from "@/lib/navigation";
import { fetchSettings, type SiteSettings } from "@/lib/settings";
import { VoyageTracker } from "@/components/public/VoyageTracker";
import { PageTransition } from "@/components/public/PageTransition";
import { MobileMenu } from "@/components/public/MobileMenu";
import { ScrollHeader } from "@/components/public/ScrollHeader";
import "./public.css";

export const dynamic = "force-dynamic";

// Fallback nav used if the DB fetch fails (so the site never breaks)
const FALLBACK_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", position: 0, visible: true },
  { id: "courses", label: "Courses", href: "/courses", position: 1, visible: true },
  { id: "resources", label: "Resources", href: "/resources", position: 2, visible: true },
  { id: "teachers", label: "Faculty", href: "/teachers", position: 3, visible: true },
  { id: "about", label: "About", href: "/about", position: 4, visible: true },
];

// Fallback settings used if the DB fetch fails (mirrors the old hardcoded values).
const FALLBACK_SETTINGS: SiteSettings = {
  siteName: "TAG Educators",
  tagline: "The Ark Global Educators",
  description: "The Ark Global Educators - small-batch Cambridge tutoring, live online.",
  email: "",
  phone: "+92 316 2165779",
  address: "",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  domain: "tageducators.com",
  metaDescription:
    "Small-batch Cambridge O Level, A Level and IGCSE tutoring, taught by specialist tutors who've sat these exact exams.",
};

// Convert a phone string like "+92 316 2165779" into a wa.me link.
function phoneToWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

// Build the page <title> and meta description from settings.
export async function generateMetadata(): Promise<Metadata> {
  const { data: s } = await fetchSettings();
  const settings = s ?? FALLBACK_SETTINGS;
  const name = settings.siteName || FALLBACK_SETTINGS.siteName;
  const tagline = settings.tagline || FALLBACK_SETTINGS.tagline;
  return {
    title: `${name} - ${tagline}`,
    description: settings.metaDescription || FALLBACK_SETTINGS.metaDescription,
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch nav items + settings from the DB in parallel; fall back to defaults
  // on any error so the site never breaks.
  const [navResult, settingsResult] = await Promise.all([
    fetchVisibleNavItems(),
    fetchSettings(),
  ]);
  // Use fallback nav as the source of truth — DB nav items may be stale.
  const nav = FALLBACK_NAV;
  const s = settingsResult.data ?? FALLBACK_SETTINGS;
  const siteName = s.siteName || FALLBACK_SETTINGS.siteName;
  const tagline = s.tagline || FALLBACK_SETTINGS.tagline;
  const whatsapp = phoneToWhatsApp(s.phone || FALLBACK_SETTINGS.phone);

  return (
    <div className="public-theme">
      <PageTransition />
      <MobileMenu />

      {/* WhatsApp tab */}
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener" className="ask-tab">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 20l1.2-3.6A7.5 7.5 0 1112 19.5a7.4 7.4 0 01-3.4-.8L4 20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          Ask us on WhatsApp
        </a>
      )}

      {/* Voyage tracker — the "ark on top" progress bar */}
      <VoyageTracker />

      {/* Modern scroll-aware header */}
      <ScrollHeader
        nav={nav}
        siteName={siteName}
        tagline={tagline}
      />

      <main>{children}</main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <img src="/logo.png" alt={siteName} className="brand-logo" />
              <span className="brand-text">
                <strong>{siteName}</strong>
                <em>{tagline}</em>
              </span>
            </Link>
            <svg className="arc-mark" viewBox="0 0 44 13" aria-hidden="true">
              <path d="M2 11 Q22 -3 42 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>{s.description || FALLBACK_SETTINGS.description}</p>
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            {nav.map((item) => (
              <Link key={item.id} href={item.href}>{item.label}</Link>
            ))}
          </div>
          <div className="footer-links">
            <h4>Connect</h4>
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener">WhatsApp</a>
            )}
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener">Instagram</a>
            )}
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noopener">Facebook</a>
            )}
            {s.youtube && (
              <a href={s.youtube} target="_blank" rel="noopener">YouTube</a>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
