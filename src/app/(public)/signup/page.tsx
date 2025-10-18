import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import SignupForm from './SignupForm';

export const metadata = {
  title: 'Criar conta'
};

export default async function SignupPage() {
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
        <h1 className="text-3xl font-semibold text-slate-900">Criar conta</h1>
        <p className="text-sm text-slate-500">Crie uma conta para submeter e acompanhar os seus casos.</p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <Link href="/login" className="text-brand-600 hover:text-brand-700">
          Entrar
        </Link>
      </p>
    </div>
  );
}
