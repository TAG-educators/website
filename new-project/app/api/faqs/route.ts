import { NextResponse } from 'next/server';
import { getFaqs } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const faqs = await getFaqs();
  return NextResponse.json(faqs);
}
