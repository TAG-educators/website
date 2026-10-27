import { NextResponse } from 'next/server';
import { getTestimonialRecords } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getTestimonialRecords());
}
