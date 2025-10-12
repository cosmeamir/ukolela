import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import HeaderSearch from './HeaderSearch';

async function signOutAction() {
  'use server';
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}

export default async function Header() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-semibold text-brand-600">
            Uklela
          </Link>
          <span className="hidden text-sm text-slate-500 sm:inline">
            Plataforma colaborativa para localizar pessoas desaparecidas
          </span>
        </div>
        <HeaderSearch />
        <div className="flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-full bg-brand-50 px-4 py-2 text-brand-600 hover:bg-brand-100">
                Dashboard
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-100"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-100">
                Entrar
              </Link>
              <Link href="/signup" className="rounded-full bg-brand-500 px-4 py-2 text-white shadow-sm hover:bg-brand-600">
                Registar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
