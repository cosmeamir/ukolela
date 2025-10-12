import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabaseService';
import { getUser } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function POST(_request: Request, { params }: Params) {
  const moderator = await getUser();
  if (!moderator) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  const isModerator = moderator.user_metadata?.role === 'moderator' || moderator.email?.endsWith('@uklela.org');

  if (!isModerator) {
    return NextResponse.json({ error: 'Sem permissões.' }, { status: 403 });
  }

  const supabase = createSupabaseServiceClient();

  const { error } = await supabase
    .from('cases')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('moderation_logs').insert({
    case_id: params.id,
    moderator_id: moderator.id,
    action: 'approve',
    reason: 'Caso aprovado.'
  });

  return NextResponse.json({ ok: true });
}
