import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { createSupabaseServiceClient } from '@/lib/supabaseService';
import { createCaseSchema } from '@/lib/validators';
import { getCaseThumbnailUrl } from '@/lib/images';
import type { CasePhoto } from '@/types/db';

const DEFAULT_PAGE_SIZE = 24;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = Number(url.searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE);
  const status = url.searchParams.get('status') ?? 'approved';
  const query = url.searchParams.get('query') ?? '';
  const location = url.searchParams.get('location') ?? '';

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createSupabaseServerClient();
  let builder = supabase
    .from('cases')
    .select('id, full_name, age, last_seen_location, description, case_photos(storage_path, is_primary)', { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (query) {
    builder = builder.ilike('full_name', `%${query}%`);
  }
  if (location) {
    builder = builder.ilike('last_seen_location', `%${location}%`);
  }

  const { data, count, error } = await builder;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = await Promise.all(
    (data ?? []).map(async (item) => {
      const photos = (item.case_photos as CasePhoto[] | null) ?? [];
      const primary = photos.find((photo) => photo.is_primary) ?? photos[0];
      const photoUrl = await getCaseThumbnailUrl(primary?.storage_path);

      return {
        id: item.id,
        name: item.full_name,
        age: item.age,
        location: item.last_seen_location,
        description: item.description,
        photoUrl
      };
    })
  );

  return NextResponse.json({ data: mapped, total: count ?? 0, page, pageSize });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = createCaseSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await supabase.from('profiles').upsert({
    user_id: user.id,
    full_name: user.user_metadata?.full_name ?? null
  });

  const { data, error } = await supabase
    .from('cases')
    .insert({
      ...parsed.data,
      reporter_id: user.id,
      status: 'pending_review'
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    const service = createSupabaseServiceClient();
    await service.from('moderation_logs').insert({
      case_id: data.id,
      moderator_id: null,
      action: 'note',
      reason: 'Submissão inicial criada pelo utilizador.'
    });
  } catch (error) {
    console.warn('Não foi possível registar log de moderação inicial.', error);
  }

  return NextResponse.json({ case: data });
}
