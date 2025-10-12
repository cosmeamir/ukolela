'use client';

import Image from 'next/image';
import { useState } from 'react';
import ContactModal from './ContactModal';
import { truncate } from '@/lib/utils';

interface CaseCardProps {
  id: string;
  name: string;
  age?: number | null;
  location?: string | null;
  description?: string | null;
  photoUrl?: string | null;
}

export default function CaseCard({ id, name, age, location, description, photoUrl }: CaseCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`Fotografia de ${name}`}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl text-slate-300">🕊️</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-500">
            {age ? `${age} anos · ` : ''}
            {location ? `Último local: ${location}` : 'Local desconhecido'}
          </p>
        </div>
        {description ? <p className="text-sm text-slate-600">{truncate(description, 140)}</p> : null}
        <div className="mt-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
            aria-label={`Entrar em contacto sobre ${name}`}
          >
            Entrar em contacto
          </button>
        </div>
      </div>
      {open ? <ContactModal caseId={id} caseName={name} onClose={() => setOpen(false)} /> : null}
    </article>
  );
}
