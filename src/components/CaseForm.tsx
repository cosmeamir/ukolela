'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { createCaseSchema, updateCaseSchema } from '@/lib/validators';
import type { Case } from '@/types/db';

interface CaseFormProps {
  mode?: 'create' | 'edit';
  initialCase?: Partial<Case> & { id?: string };
  onSubmitted?: (caseId: string) => void;
}

const GENDER_OPTIONS = [
  { value: '', label: 'Selecionar género' },
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'Outro', label: 'Outro' }
];

export default function CaseForm({ mode = 'create', initialCase, onSubmitted }: CaseFormProps) {
  const [fullName, setFullName] = useState(initialCase?.full_name ?? '');
  const [age, setAge] = useState(initialCase?.age?.toString() ?? '');
  const [gender, setGender] = useState(initialCase?.gender ?? '');
  const [location, setLocation] = useState(initialCase?.last_seen_location ?? '');
  const [date, setDate] = useState(initialCase?.last_seen_date ?? '');
  const [description, setDescription] = useState(initialCase?.description ?? '');
  const [contactPhone, setContactPhone] = useState(initialCase?.contact_phone ?? '');
  const [contactEmail, setContactEmail] = useState(initialCase?.contact_email ?? '');
  const [consent, setConsent] = useState(initialCase?.consent ?? false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        full_name: fullName,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        last_seen_location: location,
        last_seen_date: date || undefined,
        description: description || undefined,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        consent: consent
      };

      const validator = mode === 'create' ? createCaseSchema : updateCaseSchema;
      const parsed = validator.parse(payload);

      setLoading(true);

      let caseId = initialCase?.id ?? '';
      let response: Response;

      if (mode === 'create') {
        response = await fetch('/api/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
      } else {
        if (!caseId) throw new Error('Identificador do caso em falta.');
        response = await fetch(`/api/cases/${caseId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Erro ao guardar o caso.');
      }

      const result = await response.json();
      caseId = caseId || result.id || result.case?.id;

      if (files.length && caseId) {
        const supabase = createSupabaseBrowserClient();
        for (let index = 0; index < files.length; index += 1) {
          const file = files[index];
          const extension = file.name.split('.').pop();
          const path = `cases/${caseId}/${crypto.randomUUID()}.${extension ?? 'jpg'}`;
          const { error: uploadError } = await supabase.storage
            .from('cases')
            .upload(path, file, { cacheControl: '3600', upsert: true });
          if (uploadError) {
            console.error(uploadError);
            continue;
          }

          const { error: dbError } = await supabase
            .from('case_photos')
            .insert({ case_id: caseId, storage_path: path, is_primary: index === 0 });

          if (dbError) {
            console.error(dbError);
          }
        }
      }

      setSuccess(mode === 'create' ? 'Caso submetido com sucesso. A nossa equipa irá avaliar.' : 'Caso atualizado com sucesso.');
      setFiles([]);
      onSubmitted?.(caseId);
      if (mode === 'create') {
        setFullName('');
        setAge('');
        setGender('');
        setLocation('');
        setDate('');
        setDescription('');
        setContactPhone('');
        setContactEmail('');
        setConsent(false);
      }
    } catch (caught) {
      if (caught instanceof Error) {
        setError(caught.message);
      } else {
        setError('Ocorreu um erro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span>Nome completo</span>
          <input
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Idade (opcional)</span>
          <input
            type="number"
            min={0}
            max={120}
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Género</span>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Último local visto</span>
          <input
            required
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Data do desaparecimento</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span>Descrição adicional</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
            placeholder="Características físicas, roupas, contexto, etc."
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Telefone para contacto</span>
          <input
            required
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Email para contacto</span>
          <input
            required
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span>Fotos (máx. 3)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? []).slice(0, 3);
              setFiles(selected);
            }}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-none file:bg-brand-500 file:px-4 file:py-2 file:text-white"
          />
          <p className="text-xs text-slate-500">A primeira foto será considerada principal.</p>
        </label>
      </div>
      {mode === 'create' ? (
        <label className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
          <span>
            Confirmo que tenho consentimento para partilhar estes dados e fotografias e aceito os{' '}
            <a href="/terms" className="underline" target="_blank" rel="noreferrer">
              Termos de uso
            </a>
            .
          </span>
        </label>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-70"
        >
          {loading ? 'A guardar…' : mode === 'create' ? 'Submeter caso' : 'Guardar alterações'}
        </button>
      </div>
    </form>
  );
}
