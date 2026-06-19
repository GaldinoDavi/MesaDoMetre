-- Onda 2: entidades-filhas de campanha (npc, sessao). RLS via join em campanha,
-- já que nenhuma das duas tem user_id próprio.

create type public.npc_status as enum ('vivo', 'morto', 'desaparecido', 'aliado', 'inimigo');

create table public.npc (
  id uuid primary key default gen_random_uuid(),
  campanha_id uuid not null references public.campanha (id) on delete cascade,
  nome text not null,
  descricao text,
  motivacao text,
  status public.npc_status not null default 'vivo',
  imagem_url text,
  created_at timestamptz not null default now()
);

create table public.sessao (
  id uuid primary key default gen_random_uuid(),
  campanha_id uuid not null references public.campanha (id) on delete cascade,
  data date not null,
  resumo text,
  notas text,
  created_at timestamptz not null default now()
);

create index npc_campanha_id_idx on public.npc (campanha_id);
create index sessao_campanha_id_idx on public.sessao (campanha_id);

alter table public.npc enable row level security;
alter table public.sessao enable row level security;

create policy "npc_select_own"
  on public.npc for select
  to authenticated
  using (
    exists (
      select 1 from public.campanha
      where campanha.id = npc.campanha_id
        and campanha.user_id = auth.uid()
    )
  );

create policy "npc_insert_own"
  on public.npc for insert
  to authenticated
  with check (
    exists (
      select 1 from public.campanha
      where campanha.id = npc.campanha_id
        and campanha.user_id = auth.uid()
    )
  );

create policy "npc_update_own"
  on public.npc for update
  to authenticated
  using (
    exists (
      select 1 from public.campanha
      where campanha.id = npc.campanha_id
        and campanha.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.campanha
      where campanha.id = npc.campanha_id
        and campanha.user_id = auth.uid()
    )
  );

create policy "npc_delete_own"
  on public.npc for delete
  to authenticated
  using (
    exists (
      select 1 from public.campanha
      where campanha.id = npc.campanha_id
        and campanha.user_id = auth.uid()
    )
  );

create policy "sessao_select_own"
  on public.sessao for select
  to authenticated
  using (
    exists (
      select 1 from public.campanha
      where campanha.id = sessao.campanha_id
        and campanha.user_id = auth.uid()
    )
  );

create policy "sessao_insert_own"
  on public.sessao for insert
  to authenticated
  with check (
    exists (
      select 1 from public.campanha
      where campanha.id = sessao.campanha_id
        and campanha.user_id = auth.uid()
    )
  );

create policy "sessao_update_own"
  on public.sessao for update
  to authenticated
  using (
    exists (
      select 1 from public.campanha
      where campanha.id = sessao.campanha_id
        and campanha.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.campanha
      where campanha.id = sessao.campanha_id
        and campanha.user_id = auth.uid()
    )
  );

create policy "sessao_delete_own"
  on public.sessao for delete
  to authenticated
  using (
    exists (
      select 1 from public.campanha
      where campanha.id = sessao.campanha_id
        and campanha.user_id = auth.uid()
    )
  );
