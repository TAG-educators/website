import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  if (!supabase) return NextResponse.json(null);

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'home';
  const preview = searchParams.get('preview');

  try {
    // Preview mode: return the saved draft sections if present.
    if (preview) {
      const { data: draft, error: draftErr } = await supabase
        .from('pages')
        .select('draft_sections')
        .eq('slug', slug)
        .single();
      if (!draftErr && draft && Array.isArray(draft.draft_sections)) {
        return NextResponse.json(draft.draft_sections);
      }
    }

    const { data, error } = await supabase
      .from('pages')
      .select('sections')
      .eq('slug', slug)
      .single();

    if (error || !data) return NextResponse.json(null);

    return NextResponse.json(data.sections || []);
  } catch {
    return NextResponse.json(null);
  }
}
