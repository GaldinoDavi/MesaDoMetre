-- Onda 1: tabela campanha (raiz de domínio) com RLS por usuário.

create table public.campanha (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  sistema text,
  sinopse text,
  created_at timestamptz not null default now()
);

create index campanha_user_id_idx on public.campanha (user_id);

alter table public.campanha enable row level security;

create policy "campanha_select_own"
  on public.campanha for select
  to authenticated
  using (user_id = auth.uid());

create policy "campanha_insert_own"
  on public.campanha for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "campanha_update_own"
  on public.campanha for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "campanha_delete_own"
  on public.campanha for delete
  to authenticated
  using (user_id = auth.uid());
