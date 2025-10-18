import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { contactRequestSchema } from '@/lib/validators';

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('contact_requests').insert(parsed.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
