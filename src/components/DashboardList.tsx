'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import type { Case } from '@/types/db';

interface DashboardListProps {
  cases: Case[];
}

const STATUS_LABEL: Record<Case['status'], string> = {
  pending_review: 'Em avaliação',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  closed: 'Encerrado'
};

export default function DashboardList({ cases }: DashboardListProps) {
  const router = useRouter();

  const handleCloseCase = async (caseId: string) => {
    const confirmClose = window.confirm('Tem a certeza que deseja encerrar este caso?');
    if (!confirmClose) return;

    const response = await fetch(`/api/cases/${caseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' })
    });

    if (!response.ok) {
      alert('Não foi possível encerrar o caso.');
      return;
    }

    router.refresh();
  };

  if (!cases.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Ainda não submeteu nenhum caso. Clique em "Novo caso" para começar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden grid-cols-[2fr_repeat(3,1fr)] bg-slate-50 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
        <span>Nome</span>
        <span>Estado</span>
        <span>Submetido em</span>
        <span>Última atualização</span>
      </div>
      <div className="divide-y divide-slate-100">
        {cases.map((item) => (
          <div key={item.id} className="grid gap-4 px-6 py-5 sm:grid-cols-[2fr_repeat(3,1fr)] sm:items-center">
            <div>
              <p className="text-base font-semibold text-slate-900">{item.full_name}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                  {STATUS_LABEL[item.status]}
                </span>
                <Link href={`/cases/${item.id}`} className="underline">
                  Ver
                </Link>
                <Link href={`/cases/${item.id}/edit`} className="underline">
                  Editar
                </Link>
                {item.status !== 'closed' ? (
                  <button type="button" onClick={() => handleCloseCase(item.id)} className="underline">
                    Encerrar
                  </button>
                ) : null}
              </div>
            </div>
            <p className="text-sm text-slate-500">{STATUS_LABEL[item.status]}</p>
            <p className="text-sm text-slate-500">{formatDate(item.created_at)}</p>
            <p className="text-sm text-slate-500">{formatDate(item.updated_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
