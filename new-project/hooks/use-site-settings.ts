'use client';

import { useState, useEffect } from 'react';
import { useSiteData } from '@/components/providers/site-data-provider';

export type SiteSettingsData = {
  siteName?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  domain?: string;
  metaDescription?: string;
  font?: string;
};

/**
 * Fetches site-wide settings from the admin (via /api/settings).
 */
export function useSiteSettings() {
  const initial = useSiteData()?.settings ?? null;
  const [settings, setSettings] = useState<SiteSettingsData | null>(initial);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
