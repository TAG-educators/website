import Link from 'next/link';
import { Ship, Mail, Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { useState, useEffect } from 'react';
import { useSiteData } from '@/components/providers/site-data-provider';
import type { Course } from '@/lib/courses';
import { useNavigation, type NavLink } from '@/hooks/use-navigation';
import { useSiteSettings, type SiteSettingsData } from '@/hooks/use-site-settings';

const defaultNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/faculty', label: 'Faculty' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  const { links: navLinks } = useNavigation();
  const { settings } = useSiteSettings();
  const [courses, setCourses] = useState<Course[]>(useSiteData()?.courses ?? []);

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(data => {
      if (data && data.length > 0) setCourses(data);
    }).catch(() => {});
  }, []);

  const effectiveNavLinks = navLinks.length > 0 ? navLinks : defaultNavLinks;
  const siteName = settings?.siteName || siteConfig.name;
  const tagline = settings?.tagline || siteConfig.tagline;
  const email = settings?.email || siteConfig.email;
  const instagram = settings?.instagram;
  const facebook = settings?.facebook;
  const youtube = settings?.youtube;
  const shortDescription = settings?.description || siteConfig.shortDescription;
  return (
    <footer className="relative overflow-hidden bg-ocean-deeper text-white">
      {/* Wave decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ocean/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="TAG Educators" className="h-10 w-10 rounded-full" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold">TAG</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50">
                  Educators
                </span>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/60 max-w-xs">
              {shortDescription}
            </p>
            <p className="mt-4 font-display text-lg italic text-ocean-light">
              {tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Navigation
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Courses
            </h3>
            <ul className="mt-5 space-y-3">
              {courses.slice(0, 6).map((course) => (
                <li key={course.slug}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/courses"
                  className="text-sm font-medium text-ocean-light transition-colors hover:text-white"
                >
                  View all courses →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-ocean-light" />
                  <span>WhatsApp: {siteConfig.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ocean-light" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-sm text-white/70">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ocean-light" />
                  <span>Live online sessions worldwide</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 transition-colors hover:text-white">
                Instagram
              </a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 transition-colors hover:text-white">
                Facebook
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 transition-colors hover:text-white">
                YouTube
              </a>
            )}
            <Link href="/privacy" className="text-sm text-white/50 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-white/50 transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
