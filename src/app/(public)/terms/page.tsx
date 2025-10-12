export const metadata = {
  title: 'Termos de uso'
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-16 text-sm text-slate-600">
      <h1 className="text-3xl font-semibold text-slate-900">Termos de Uso</h1>
      <p>
        Ao utilizar a plataforma Uklela concorda em fornecer informações verídicas e atualizadas. Os dados submetidos serão
        utilizados exclusivamente para a divulgação de casos de pessoas desaparecidas e contacto pela equipa de apoio.
      </p>
      <p>
        Ao submeter um caso declara que possui consentimento das pessoas envolvidas para partilhar dados pessoais e
        fotografias. É proibido o envio de conteúdos ofensivos, ilegais ou que infrinjam direitos de terceiros.
      </p>
      <p>
        Os casos submetidos passam por uma fase de moderação para validação. A equipa reserva-se o direito de rejeitar ou
        remover conteúdos que não cumpram as políticas da plataforma.
      </p>
      <p>
        A qualquer momento poderá solicitar a eliminação de um caso através dos canais de contacto ou encerrar o caso no
        dashboard pessoal.
      </p>
    </div>
  );
}
