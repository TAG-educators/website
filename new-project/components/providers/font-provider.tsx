'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Font name → Google Fonts URL mapping
const FONT_URLS: Record<string, string> = {
  'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
  'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap',
  'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
  'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
  'Source Sans Pro': 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700;900&display=swap',
  'Nunito Sans': 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap',
  'DM Sans': 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap',
};

const FONT_FAMILY: Record<string, string> = {
  'Inter': "'Inter', system-ui, sans-serif",
  'Poppins': "'Poppins', system-ui, sans-serif",
  'Roboto': "'Roboto', system-ui, sans-serif",
  'Open Sans': "'Open Sans', system-ui, sans-serif",
  'Lato': "'Lato', system-ui, sans-serif",
  'Montserrat': "'Montserrat', system-ui, sans-serif",
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Source Sans Pro': "'Source Sans Pro', system-ui, sans-serif",
  'Nunito Sans': "'Nunito Sans', system-ui, sans-serif",
  'DM Sans': "'DM Sans', system-ui, sans-serif",
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState<string | null>(null);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    supabase
      .from('site_settings')
      .select('font')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.font) {
          setFont(data.font);
        }
      });
  }, []);

  useEffect(() => {
    if (!font || !FONT_URLS[font]) return;

    // Inject the Google Fonts stylesheet
    const linkId = 'dynamic-font-stylesheet';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = FONT_URLS[font];

    // Apply the font to the body
    document.body.style.fontFamily = FONT_FAMILY[font];
  }, [font]);

  return <>{children}</>;
}
