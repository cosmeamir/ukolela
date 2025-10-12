'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function SignupForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message || 'Não foi possível criar a conta.');
      setLoading(false);
      return;
    }

    if (data.user?.identities?.length === 0) {
      setError('Este email já está registado.');
      setLoading(false);
      return;
    }

    setSuccess('Conta criada. Verifique o seu email para confirmar o registo.');
    setFullName('');
    setEmail('');
    setPassword('');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="flex flex-col gap-1 text-sm">
        <span>Nome completo</span>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>Password</span>
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-70"
      >
        {loading ? 'A criar…' : 'Criar conta'}
      </button>
    </form>
  );
}
