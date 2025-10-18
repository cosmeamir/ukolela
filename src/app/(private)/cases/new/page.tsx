import CaseForm from '@/components/CaseForm';
import { requireUser } from '@/lib/auth';

export const metadata = {
  title: 'Novo caso'
};

export default async function NewCasePage() {
  await requireUser();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Submeter um novo caso</h1>
        <p className="text-sm text-slate-500">
          Preencha o formulário com o máximo de detalhes possível. Após submissão, o caso ficará "Em avaliação" até ser moderado
          pela nossa equipa.
        </p>
      </div>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <CaseForm mode="create" />
      </div>
    </div>
  );
}
