import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!supabase) return NextResponse.json([]);

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('student_name');

    if (error || !data) return NextResponse.json([]);

    return NextResponse.json(data.map((t: any) => ({
      id: t.id,
      studentName: t.student_name,
      course: t.course,
      result: t.result,
      quote: t.quote,
      poster: t.poster,
      videoUrl: t.video_url,
      featured: t.featured,
    })));
  } catch {
    return NextResponse.json([]);
  }
}
