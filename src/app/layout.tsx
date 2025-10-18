import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { clsx } from 'clsx';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Uklela — Plataforma de Pessoas Desaparecidas',
    template: '%s | Uklela'
  },
  description:
    'Uklela ajuda a encontrar pessoas desaparecidas com uma plataforma leve, centrada em moderação e contacto com a equipa.',
  applicationName: 'Uklela',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={clsx(inter.variable, 'bg-slate-50 text-slate-900 min-h-screen')}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-sm text-slate-500">
            <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <p>&copy; {new Date().getFullYear()} Uklela. Todos os direitos reservados.</p>
              <div className="flex gap-4">
                <a href="/terms">Termos</a>
                <a href="/privacy">Privacidade</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
