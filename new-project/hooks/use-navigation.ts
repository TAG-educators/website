'use client';

import { useState, useEffect } from 'react';
import { useSiteData } from '@/components/providers/site-data-provider';

export type NavLink = {
  id?: string;
  href: string;
  label: string;
  position?: number;
  visible?: boolean;
};

/**
 * Fetches visible navigation items from the admin (via /api/navigation).
 */
export function useNavigation() {
  const initial = useSiteData()?.navigation ?? [];
  const [links, setLinks] = useState<NavLink[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);

  useEffect(() => {
    fetch('/api/navigation')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setLinks(data.map((n: any) => ({
            id: n.id,
            href: n.href,
            label: n.label,
            position: n.position,
            visible: n.visible,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { links, loading };
}
