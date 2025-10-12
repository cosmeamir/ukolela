'use client';

import { useState } from 'react';
import { contactRequestSchema } from '@/lib/validators';

interface ContactModalProps {
  caseId: string;
  caseName: string;
  onClose: () => void;
}

export default function ContactModal({ caseId, caseName, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const validation = contactRequestSchema.safeParse({
      case_id: caseId,
      requester_name: name,
      requester_email: email || undefined,
      requester_phone: phone || undefined,
      message
    });

    if (!validation.success) {
      setFeedback(validation.error.errors[0]?.message ?? 'Dados inválidos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data)
      });

      if (!response.ok) {
        throw new Error('Não foi possível enviar o pedido.');
      }

      setFeedback('Pedido enviado com sucesso. A nossa equipa entrará em contacto.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error(error);
      setFeedback('Ocorreu um erro ao enviar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Entrar em contacto</h2>
            <p className="text-sm text-slate-500">Caso: {caseName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
            aria-label="Fechar modal de contacto"
          >
            Fechar
          </button>
        </div>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm">
            <span>Nome</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@exemplo.com"
                className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Telefone</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(+351)"
                className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span>Mensagem</span>
            <textarea
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-brand-400"
              placeholder="Partilhe detalhes relevantes para a equipa"
            />
          </label>
          {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-70"
            >
              {loading ? 'A enviar…' : 'Enviar pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
