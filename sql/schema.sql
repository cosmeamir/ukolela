-- Enum status
drop type if exists case_status cascade;
create type case_status as enum ('pending_review','approved','rejected','closed');

-- Profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy if not exists "read own profile" on public.profiles for select using (auth.uid() = user_id);
create policy if not exists "insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy if not exists "update own profile" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Cases
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(user_id) on delete set null,
  full_name text not null,
  age int,
  gender text check (gender in ('M','F','Outro')) null,
  last_seen_location text,
  last_seen_date date,
  description text,
  contact_phone text,
  contact_email text,
  consent boolean not null default false,
  status case_status not null default 'pending_review',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.cases enable row level security;
create policy if not exists "public read approved" on public.cases for select using (status = 'approved');
create policy if not exists "reporter read own" on public.cases for select using (auth.uid() = reporter_id);
create policy if not exists "reporter insert" on public.cases for insert with check (auth.uid() = reporter_id);
create policy if not exists "reporter update own non-closed" on public.cases for update
using (auth.uid() = reporter_id) with check (auth.uid() = reporter_id and status != 'closed');

-- Photos
create table if not exists public.case_photos (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  storage_path text not null,
  is_primary boolean default false
);

alter table public.case_photos enable row level security;
create policy if not exists "owner manage photos" on public.case_photos for all
using (exists(select 1 from public.cases c where c.id = case_id and c.reporter_id = auth.uid()))
with check (exists(select 1 from public.cases c where c.id = case_id and c.reporter_id = auth.uid()));

-- Contact requests
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  requester_name text,
  requester_email text,
  requester_phone text,
  message text,
  created_at timestamp with time zone default now(),
  handled boolean default false
);

alter table public.contact_requests enable row level security;
create policy if not exists "public insert contact" on public.contact_requests for insert with check (true);

-- Moderation logs
create table if not exists public.moderation_logs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  moderator_id uuid references public.profiles(user_id),
  action text check (action in ('approve','reject','close','note')),
  reason text,
  created_at timestamp with time zone default now()
);

alter table public.moderation_logs enable row level security; -- acesso via service role

create index if not exists cases_status_idx on public.cases(status);
create index if not exists cases_full_name_idx on public.cases(full_name);
create index if not exists cases_location_idx on public.cases(last_seen_location);
create index if not exists case_photos_primary_idx on public.case_photos(case_id, is_primary);

-- Seeds opcionais
insert into public.cases (id, reporter_id, full_name, age, last_seen_location, description, contact_phone, contact_email, consent, status)
values
  ('11111111-1111-1111-1111-111111111111', null, 'Maria Silva', 32, 'Lisboa, Portugal', 'Vista pela última vez na estação de Santa Apolónia.', '+351900000000', 'apoio@uklela.org', true, 'approved'),
  ('22222222-2222-2222-2222-222222222222', null, 'João Pereira', 45, 'Porto, Portugal', 'Informações adicionais podem ajudar a encontrar João.', '+351900000001', 'apoio@uklela.org', true, 'approved'),
  ('33333333-3333-3333-3333-333333333333', null, 'Ana Costa', 18, 'Coimbra, Portugal', 'Desaparecida desde Março. Família procura informações.', '+351900000002', 'apoio@uklela.org', true, 'approved'),
  ('44444444-4444-4444-4444-444444444444', null, 'Carlos Mendes', 29, 'Faro, Portugal', 'Caso recente aguarda validação.', '+351900000003', 'apoio@uklela.org', true, 'pending_review'),
  ('55555555-5555-5555-5555-555555555555', null, 'Helena Rocha', 54, 'Braga, Portugal', 'Caso em avaliação.', '+351900000004', 'apoio@uklela.org', true, 'pending_review')
on conflict do nothing;
