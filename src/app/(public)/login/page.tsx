import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Entrar'
};

export default async function LoginPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Bem-vindo de volta</h1>
        <p className="text-sm text-slate-500">Entre para gerir os casos submetidos.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-500">
        Ainda não tem conta?{' '}
        <Link href="/signup" className="text-brand-600 hover:text-brand-700">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
