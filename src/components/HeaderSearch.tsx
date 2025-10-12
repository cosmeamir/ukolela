'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function HeaderSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [location, setLocation] = useState(searchParams.get('location') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setLocation(searchParams.get('location') ?? '');
  }, [searchParams]);

  const updateParams = (nextQuery: string, nextLocation: string) => {
    const params = new URLSearchParams(searchParams);
    if (nextQuery) {
      params.set('q', nextQuery);
    } else {
      params.delete('q');
    }
    if (nextLocation) {
      params.set('location', nextLocation);
    } else {
      params.delete('location');
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <form
      className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end"
      onSubmit={(event) => {
        event.preventDefault();
        updateParams(query.trim(), location.trim());
      }}
    >
      <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-slate-400">🔍</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar por nome"
          className="w-full border-none bg-transparent text-sm outline-none"
          aria-label="Pesquisar por nome"
        />
      </div>
      <input
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="Filtrar por local"
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none sm:w-56"
        aria-label="Filtrar por local"
      />
      <button
        type="submit"
        className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
        disabled={isPending}
      >
        {isPending ? 'A procurar…' : 'Aplicar'}
      </button>
    </form>
  );
}
