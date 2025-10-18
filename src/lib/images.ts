import { createSupabaseServiceClient } from './supabaseService';

const CASES_BUCKET = 'cases';

export async function getSignedCasePhotoUrl(path: string | null | undefined, options?: {
  expiresIn?: number;
  width?: number;
  height?: number;
}) {
  if (!path) return null;

  try {
    const supabase = createSupabaseServiceClient();
    const { expiresIn = 60 * 60, width, height } = options ?? {};

    const { data, error } = await supabase.storage.from(CASES_BUCKET).createSignedUrl(path, expiresIn, {
      transform: width || height ? { width, height, resize: 'cover' } : undefined
    });

    if (error) {
      console.error('Erro ao criar URL assinada', error);
      return null;
    }

    return data?.signedUrl ?? null;
  } catch (error) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY não configurada.', error);
    return null;
  }
}

export async function getCaseThumbnailUrl(path: string | null | undefined) {
  return getSignedCasePhotoUrl(path, { expiresIn: 60 * 30, width: 400, height: 400 });
}
