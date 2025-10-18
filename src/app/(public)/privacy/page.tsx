export const metadata = {
  title: 'Política de privacidade'
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-16 text-sm text-slate-600">
      <h1 className="text-3xl font-semibold text-slate-900">Política de Privacidade</h1>
      <p>
        A Uklela trata os dados pessoais fornecidos com confidencialidade e apenas para os fins de divulgação e gestão de casos
        de pessoas desaparecidas. Os dados são armazenados na infraestrutura da Supabase em conformidade com as políticas de
        segurança e retenção da plataforma.
      </p>
      <p>
        Apenas a equipa autorizada tem acesso aos detalhes submetidos e aos pedidos de contacto. Os dados podem ser partilhados
        com autoridades competentes quando necessário para auxiliar investigações.
      </p>
      <p>
        Pode solicitar a remoção dos seus dados ou atualização das informações submetidas através dos canais de contacto ou do
        dashboard pessoal. Para questões adicionais contacte-nos via formulário de contacto disponível na página inicial.
      </p>
    </div>
  );
}
