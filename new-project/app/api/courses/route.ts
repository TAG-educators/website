import { NextResponse } from 'next/server';
import { getCourses } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const courses = await getCourses();
  return NextResponse.json(courses);
}
