'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

export const createSupabaseBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials não configurados. Verifique as variáveis de ambiente.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
