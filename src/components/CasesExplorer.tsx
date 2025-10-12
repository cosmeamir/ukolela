'use client';

import { useCallback, useMemo, useState } from 'react';
import CaseCard from './CaseCard';
import PaginationTrigger from './PaginationTrigger';

interface CaseCardData {
  id: string;
  name: string;
  age?: number | null;
  location?: string | null;
  description?: string | null;
  photoUrl?: string | null;
}

interface CasesExplorerProps {
  initialCases: CaseCardData[];
  total: number;
  pageSize: number;
  query?: string;
  location?: string;
}

export default function CasesExplorer({ initialCases, total, pageSize, query, location }: CasesExplorerProps) {
  const [cases, setCases] = useState(initialCases);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = useMemo(() => cases.length < total, [cases.length, total]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const params = new URLSearchParams({
      page: nextPage.toString(),
      pageSize: pageSize.toString(),
      status: 'approved'
    });
    if (query) params.set('query', query);
    if (location) params.set('location', location);

    const response = await fetch(`/api/cases?${params.toString()}`);
    if (response.ok) {
      const payload = await response.json();
      setCases((previous) => [...previous, ...payload.data]);
      setPage(nextPage);
    }
    setLoading(false);
  }, [hasMore, loading, page, pageSize, query, location]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((item) => (
          <CaseCard key={item.id} id={item.id} name={item.name} age={item.age} location={item.location} description={item.description} photoUrl={item.photoUrl} />
        ))}
      </div>
      {hasMore ? (
        <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
          <span>{loading ? 'A carregar mais casos…' : 'A carregar automaticamente mais casos…'}</span>
          <PaginationTrigger onVisible={loadMore} disabled={loading} />
        </div>
      ) : (
        <p className="text-center text-sm text-slate-400">Não há mais casos para mostrar.</p>
      )}
    </div>
  );
}
