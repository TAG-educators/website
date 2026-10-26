import { NextResponse } from 'next/server';
import { getFaculty } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const faculty = await getFaculty();
  return NextResponse.json(faculty);
}
