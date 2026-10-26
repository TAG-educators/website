import { NextResponse } from 'next/server';
import { getCourseResources } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const resources = await getCourseResources();
  return NextResponse.json(resources);
}
