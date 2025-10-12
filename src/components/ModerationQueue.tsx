'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { CaseWithPhotos } from '@/types/db';
import { truncate } from '@/lib/utils';

interface ModerationQueueProps {
  cases: Array<CaseWithPhotos & { primaryPhotoUrl?: string | null }>;
}

export default function ModerationQueue({ cases }: ModerationQueueProps) {
  const router = useRouter();

  const handleAction = async (caseId: string, action: 'approve' | 'reject') => {
    let body: Record<string, unknown> | undefined;
    if (action === 'reject') {
      const reason = prompt('Indique a razão da rejeição');
      if (!reason) return;
      body = { reason };
    }

    const response = await fetch(`/api/moderation/${caseId}/${action}`, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      alert('Não foi possível completar a ação.');
      return;
    }

    router.refresh();
  };

  if (!cases.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Não existem casos pendentes de moderação.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cases.map((item) => (
        <article key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 md:w-64">
              {item.primaryPhotoUrl ? (
                <Image src={item.primaryPhotoUrl} alt={`Fotografia de ${item.full_name}`} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl text-slate-300">🕊️</div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-slate-900">{item.full_name}</h3>
                <p className="text-sm text-slate-500">
                  {item.age ? `${item.age} anos · ` : ''}
                  Último local: {item.last_seen_location ?? '—'}
                </p>
              </div>
              {item.description ? (
                <p className="text-sm text-slate-600">{truncate(item.description, 200)}</p>
              ) : null}
              <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                <p>Contacto: {item.contact_phone ?? '—'}</p>
                <p>Email: {item.contact_email ?? '—'}</p>
                <p>Submetido em: {new Date(item.created_at).toLocaleString('pt-PT')}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => handleAction(item.id, 'reject')}
              className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Rejeitar
            </button>
            <button
              type="button"
              onClick={() => handleAction(item.id, 'approve')}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
            >
              Aprovar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
