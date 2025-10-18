import { notFound } from 'next/navigation';
import CaseForm from '@/components/CaseForm';
import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface Params {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Editar caso'
};

export default async function EditCasePage({ params }: Params) {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('cases')
    .select('*')
    .eq('id', params.id)
    .eq('reporter_id', user.id)
    .single();

  if (!data) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Editar caso</h1>
        <p className="text-sm text-slate-500">
          Atualize as informações com os dados mais recentes. Alterações serão novamente avaliadas pela equipa.
        </p>
      </div>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <CaseForm mode="edit" initialCase={data} />
      </div>
    </div>
  );
}
