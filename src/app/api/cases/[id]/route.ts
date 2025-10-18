import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { createSupabaseServiceClient } from '@/lib/supabaseService';
import { updateCaseSchema } from '@/lib/validators';
import { getSignedCasePhotoUrl } from '@/lib/images';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('cases')
    .select('*, case_photos(*)')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const photos = await Promise.all(
    (data.case_photos ?? []).map(async (photo: { id: string; storage_path: string; is_primary: boolean }) => ({
      ...photo,
      signedUrl: await getSignedCasePhotoUrl(photo.storage_path, { width: 800, height: 800 })
    }))
  );

  return NextResponse.json({ ...data, photos });
}

export async function PATCH(request: Request, { params }: Params) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = updateCaseSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates = {
    ...parsed.data,
    updated_at: new Date().toISOString()
  } as Record<string, unknown>;

  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', params.id)
    .eq('reporter_id', user.id)
    .select('*')
    .single();

  if (error) {
    if (payload.status === 'closed') {
      try {
        const service = createSupabaseServiceClient();
        const { error: serviceError, data: serviceData } = await service
          .from('cases')
          .update({ status: 'closed', updated_at: new Date().toISOString() })
          .eq('id', params.id)
          .eq('reporter_id', user.id)
          .select('*')
          .single();

        if (serviceError) {
          return NextResponse.json({ error: serviceError.message }, { status: 400 });
        }

        await service.from('moderation_logs').insert({
          case_id: params.id,
          moderator_id: user.id,
          action: 'close',
          reason: 'Encerrado pelo repórter.'
        });

        return NextResponse.json({ case: serviceData });
      } catch (serviceError) {
        console.error(serviceError);
        return NextResponse.json({ error: 'Não foi possível encerrar o caso.' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ case: data });
}
