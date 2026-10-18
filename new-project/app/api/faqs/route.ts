import { NextResponse } from 'next/server';
import { getFaqs } from '@/lib/supabase-data';

export async function GET() {
  const faqs = await getFaqs();
  return NextResponse.json(faqs);
}
