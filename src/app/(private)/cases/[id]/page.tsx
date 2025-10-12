import Image from 'next/image';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { getSignedCasePhotoUrl } from '@/lib/images';
import type { CasePhoto } from '@/types/db';

interface Params {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Detalhes do caso'
};

export default async function CaseDetailsPage({ params }: Params) {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('cases')
    .select('*, case_photos(*)')
    .eq('id', params.id)
    .eq('reporter_id', user.id)
    .single();

  if (!data) {
    notFound();
  }

  const photos = await Promise.all(
    ((data.case_photos as CasePhoto[] | null) ?? []).map(async (photo) => ({
      ...photo,
      signedUrl: await getSignedCasePhotoUrl(photo.storage_path, { width: 800, height: 800 })
    }))
  );

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-900">{data.full_name}</h1>
        <p className="text-sm text-slate-500">
          Estado atual: <span className="font-semibold text-brand-600">{data.status}</span>
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 text-sm text-slate-600">
          <p><strong>Idade:</strong> {data.age ?? '—'}</p>
          <p><strong>Género:</strong> {data.gender ?? '—'}</p>
          <p><strong>Último local visto:</strong> {data.last_seen_location ?? '—'}</p>
          <p><strong>Data:</strong> {data.last_seen_date ?? '—'}</p>
          <p><strong>Contacto:</strong> {data.contact_phone ?? '—'} · {data.contact_email ?? '—'}</p>
        </div>
        <p className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          {data.description ?? 'Sem descrição adicional.'}
        </p>
      </div>
      {photos.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200">
              {photo.signedUrl ? (
                <Image src={photo.signedUrl} alt={`Fotografia ${data.full_name}`} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl text-slate-300">🕊️</div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
