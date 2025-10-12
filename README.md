# Uklela

Plataforma web leve para divulgação e moderação de casos de pessoas desaparecidas. Desenvolvida com Next.js (App Router),
TypeScript, Tailwind CSS e Supabase (Auth, Postgres e Storage).

## Funcionalidades

- Homepage pública com pesquisa e filtro por local, cards responsivos e carregamento infinito.
- Autenticação com Supabase (email e palavra-passe) e onboarding simplificado.
- Submissão de casos com consentimento obrigatório, upload de fotografias para bucket privado e estado "pending_review".
- Dashboard do utilizador para acompanhar estados (`pending_review`, `approved`, `rejected`, `closed`) e encerrar casos.
- Fila de moderação para a equipa aprovar/rejeitar casos usando rotas protegidas com a *service role key*.
- Formulário "Entrar em contacto" que gera pedidos para a equipa responder offline.
- Páginas legais (/terms e /privacy) e manifesto PWA básico.

## Requisitos

- Node.js 18+
- Conta Supabase (Auth + Postgres + Storage)

## Configuração

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Crie um ficheiro `.env.local` baseado em `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=xxxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

3. Configure a base de dados no Supabase executando o script `sql/schema.sql` (SQL editor):

```sql
\i sql/schema.sql
```

4. Crie um bucket **privado** chamado `cases` no Storage. Recomenda-se ativar políticas que permitam *upload* apenas ao repórter (ver
script de RLS). As fotografias são guardadas em `cases/{case_id}/{uuid}.jpg`.

5. (Opcional) Seeds iniciais: inserir alguns registos `cases` e `case_photos` para testar a homepage.

## Scripts

- `npm run dev` – inicia o servidor de desenvolvimento na porta 3000.
- `npm run build` – gera a build de produção.
- `npm run start` – inicia a build de produção.
- `npm run lint` – validações ESLint.
- `npm run test` – testes unitários (Vitest).

## Deploy

1. **Supabase:**
   - Crie um projecto e aplique o `sql/schema.sql`.
   - Configure variáveis de ambiente (anon/service role) e bucket `cases` privado.
   - Opcional: defina `role` do moderador em `auth.users.user_metadata` (`{"role":"moderator"}`).

2. **Vercel:**
   - Novo projecto ligado ao repositório.
   - Defina as variáveis `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
   - Ative o Next.js App Router (versão 14+). O build padrão (`npm run build`) é suficiente.

## Testes

Inclui testes de *smoke* com Vitest em `tests/api.spec.ts` (ver secção de testes). Execute com:

```bash
npm run test
```

## Segurança & Moderação

- Chave `SUPABASE_SERVICE_ROLE_KEY` é usada apenas em rotas server-side de moderação e geração de URLs assinadas.
- RLS garante que apenas casos aprovados são públicos e que repórteres apenas alteram os seus dados.
- Moderadores necessitam de `user_metadata.role = 'moderator'` ou email `@uklela.org`.

## Estrutura

```
src/
  app/
    (public)/               # Páginas públicas
    (private)/              # Páginas autenticadas
    api/                    # Rotas API (Next.js)
  components/               # Componentes UI reutilizáveis
  lib/                      # Utilitários Supabase, auth, imagens, validações
  types/                    # Tipos partilhados
public/                     # Assets estáticos + manifest PWA
sql/schema.sql              # Estrutura da base de dados e políticas
```

## Licença

MIT
