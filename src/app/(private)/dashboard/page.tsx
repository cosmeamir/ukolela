import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import DashboardList from '@/components/DashboardList';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard'
};

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('reporter_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Os meus casos</h1>
          <p className="text-sm text-slate-500">Acompanhe o estado das submissões e atualize as informações quando necessário.</p>
        </div>
        <Link
          href="/cases/new"
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
        >
          Novo caso
        </Link>
      </div>
      <div className="mt-8">
        <DashboardList cases={data ?? []} />
      </div>
    </div>
  );
}
