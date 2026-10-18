import { NextResponse } from 'next/server';
import { getFaculty } from '@/lib/supabase-data';

export async function GET() {
  const faculty = await getFaculty();
  return NextResponse.json(faculty);
}
