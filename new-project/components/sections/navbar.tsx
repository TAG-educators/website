'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/providers/cart-provider';
import { siteConfig } from '@/lib/site-config';

const defaultNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/faculty', label: 'Faculty' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
];

// Links hidden from desktop nav on the homepage (still shown in mobile menu)
const hideOnHomeDesktop = ['Courses', 'Faculty'];

export function Navbar() {
  const pathname = usePathname();
  const [overDark, setOverDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(defaultNavLinks);
  const { itemCount } = useCart();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/navigation').then(r => r.json()).then(data => {
      if (data && data.length > 0) {
        setNavLinks(data.map((n: any) => ({ href: n.href, label: n.label })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const headerHeight = 80;
      const probe = document.elementFromPoint(window.innerWidth / 2, headerHeight);
      const darkSection = probe?.closest('[data-header-theme="dark"]');
      setOverDark(!!darkSection);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: '#150c1b',
        }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="TAG Educators home">
            <img src="/logo.png" alt="TAG Educators" className="h-10 w-10 rounded-full transition-transform group-hover:scale-105" />
            <div className="flex flex-col leading-[1.2]">
              <span className="text-[0.95rem] font-bold tracking-tight text-[#f5f2f8]">
                TAG Educators
              </span>
              <span className="text-[0.72rem] font-normal text-[#a89fb5]">
                The Ark Global Educators
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-[#f5f2f8]'
                    : 'text-[#a89fb5] hover:text-[#f5f2f8]'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-0 -bottom-1 h-[1.5px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #b472cc, #d4a0e8)' }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex lg:mr-16">
            <Link
              href="/cart"
              data-cart-target="desktop"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                'text-[#a89fb5] hover:text-[#f5f2f8]'
              )}
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ocean px-1 text-[10px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/cart"
              data-cart-target="mobile"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                'text-[#a89fb5] hover:text-[#f5f2f8]'
              )}
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  key={`m-${itemCount}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ocean px-1 text-[10px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#f5f2f8] hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 right-0 z-50 bg-[#150c1b]/95 backdrop-blur-2xl lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                  <img src="/logo.png" alt="TAG Educators" className="h-9 w-9 rounded-full" />
                  <span className="font-display text-lg font-bold text-white">TAG Educators</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-0 px-4 pb-6 sm:px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'border-b border-white/10 px-2 py-3.5 text-base font-medium transition-colors',
                      isActive(link.href)
                        ? 'text-[#b472cc]'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href={siteConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-base font-semibold text-white hover:bg-white/10"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
