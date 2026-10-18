import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/supabase-data';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings || {});
}
