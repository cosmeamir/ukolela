import CasesExplorer from '@/components/CasesExplorer';
import EmptyState from '@/components/EmptyState';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { getCaseThumbnailUrl } from '@/lib/images';
import type { CasePhoto } from '@/types/db';

const PAGE_SIZE = 24;

interface PageProps {
  searchParams?: {
    q?: string;
    location?: string;
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const query = searchParams?.q ?? '';
  const location = searchParams?.location ?? '';

  const supabase = createSupabaseServerClient();
  let builder = supabase
    .from('cases')
    .select('id, full_name, age, last_seen_location, description, case_photos(storage_path, is_primary)', { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (query) {
    builder = builder.ilike('full_name', `%${query}%`);
  }
  if (location) {
    builder = builder.ilike('last_seen_location', `%${location}%`);
  }

  const { data, count, error } = await builder;

  if (error) {
    console.error(error);
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState title="Ocorreu um erro" description="Não foi possível carregar os casos. Tente novamente mais tarde." />
      </div>
    );
  }

  const cases = await Promise.all(
    (data ?? []).map(async (item) => {
      const photos = (item.case_photos as CasePhoto[] | null) ?? [];
      const primary = photos.find((photo) => photo.is_primary) ?? photos[0];
      const photoUrl = await getCaseThumbnailUrl(primary?.storage_path);

      return {
        id: item.id,
        name: item.full_name,
        age: item.age,
        location: item.last_seen_location,
        description: item.description,
        photoUrl
      };
    })
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="space-y-4">
        <header className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold text-slate-900">Casos ativos</h1>
          <p className="text-sm text-slate-500">
            Apenas casos aprovados pela equipa de moderação são apresentados. Utilize a pesquisa e filtros para refinar a lista.
          </p>
        </header>
        {cases.length ? (
          <CasesExplorer
            initialCases={cases}
            total={count ?? cases.length}
            pageSize={PAGE_SIZE}
            query={query || undefined}
            location={location || undefined}
          />
        ) : (
          <EmptyState
            title="Sem resultados"
            description="Não encontrámos casos com os filtros atuais. Ajuste os termos de pesquisa."
          />
        )}
      </section>
    </div>
  );
}
