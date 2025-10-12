import { redirect } from 'next/navigation';
import ModerationQueue from '@/components/ModerationQueue';
import { requireUser } from '@/lib/auth';
import { createSupabaseServiceClient } from '@/lib/supabaseService';
import { getSignedCasePhotoUrl } from '@/lib/images';
import type { CasePhoto } from '@/types/db';

export const metadata = {
  title: 'Moderação de casos'
};

export default async function ModerationPage() {
  const user = await requireUser();
  const isModerator = user.user_metadata?.role === 'moderator' || user.email?.endsWith('@uklela.org');

  if (!isModerator) {
    redirect('/dashboard');
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('cases')
    .select('*, case_photos(storage_path, is_primary)')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
  }

  const cases = await Promise.all(
    (data ?? []).map(async (item) => {
      const photos = (item.case_photos as CasePhoto[] | null) ?? [];
      const primary = photos.find((photo) => photo.is_primary) ?? photos[0];
      const primaryPhotoUrl = await getSignedCasePhotoUrl(primary?.storage_path, { width: 600, height: 600 });

      return {
        ...item,
        primaryPhotoUrl
      };
    })
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Fila de moderação</h1>
        <p className="text-sm text-slate-500">
          Analise cada submissão. Apenas casos aprovados serão apresentados publicamente na homepage.
        </p>
      </div>
      <div className="mt-8">
        <ModerationQueue cases={cases} />
      </div>
    </div>
  );
}
