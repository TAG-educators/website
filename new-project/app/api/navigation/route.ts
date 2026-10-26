import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!supabase) return NextResponse.json([]);

  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('visible', true)
      .order('position');

    if (error || !data) return NextResponse.json([]);

    return NextResponse.json(data.map((n: any) => ({
      id: n.id,
      label: n.label,
      href: n.href,
      position: n.position,
      visible: n.visible,
    })));
  } catch {
    return NextResponse.json([]);
  }
}
