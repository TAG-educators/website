'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    // Fade between client-side route changes without hiding the initial page.
    document.documentElement.classList.add('tag-arriving');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('tag-arriving');
      });
    });
  }, [pathname]);

  useEffect(() => {
    // Intercept link clicks for fade-out before navigation
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      const href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      e.preventDefault();
      document.body.classList.add('tag-leaving');
      setTimeout(() => {
        router.push(url.pathname + url.search + url.hash);
      }, 260);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  // Guard against stuck faded-out state on bfcache restore
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        document.body.classList.remove('tag-leaving');
        document.documentElement.classList.remove('tag-arriving');
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return <>{children}</>;
}
