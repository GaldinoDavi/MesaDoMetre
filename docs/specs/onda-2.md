# Spec — Onda 2: NPCs e Sessões

> Spec de feature derivada do `PRD.md`. Pressupõe a Onda 1 concluída (CRUD de
> campanha funcionando, com RLS). Introduz as entidades-filhas de campanha:
> `npc` e `sessao`.

## 1. Objetivo

Dentro de uma campanha específica, o usuário consegue criar, listar, editar e
excluir NPCs e sessões. Isso completa o modelo de dados central do produto
(`PRD.md` §5: `campanha` → `npc`/`sessao`).

Resultado esperado: ao abrir uma campanha (`/dashboard/[id]`), o usuário vê o
nome/sistema/sinopse dela e, abaixo, duas listas — NPCs e Sessões — cada uma
com seu próprio CRUD, sem nunca ver ou acessar entidades de campanhas de outro
usuário (ou de outra campanha sua).

## 2. Escopo

### Dentro
- Tabelas `npc` e `sessao` no Postgres, ambas referenciando `campanha_id`, com
  RLS restringindo acesso a quem é dono da campanha referenciada.
- Nova página `/dashboard/[id]` (detalhe da campanha), substituindo o link
  "Editar" da listagem como destino principal ao clicar numa campanha.
- CRUD completo de NPC: `nome` (obrigatório), `descricao`, `motivacao`,
  `status` (enum, padrão `vivo`), `imagem_url` (link de texto, sem upload).
- CRUD completo de sessão: `data` (obrigatória), `resumo`, `notas`.
- Confirmação antes de excluir, mesmo padrão da Onda 1.

### Fora (não fazer nesta onda)
- Geração de NPC por IA — Onda 3.
- Upload de arquivo de imagem — Onda 4 ("Imagem como contexto"); por agora
  `imagem_url` é só um campo de link opcional.
- Compartilhamento de campanha entre mestres.
- Qualquer mudança no CRUD de campanha em si (Onda 1) além de linkar para a
  nova página de detalhe.

## 3. Pré-requisitos — o que VOCÊ faz pessoalmente

1. Onda 1 concluída e validada (tabela `campanha` funcionando).
2. Rodar, no SQL Editor do Supabase, a migration desta onda (tabelas `npc` e
   `sessao` + RLS) — mesma lógica da Onda 1: a publishable key não tem
   permissão de DDL.

## 4. Requisitos funcionais

- **RF1.** Abrir uma campanha (`/dashboard/[id]`) mostra a lista de NPCs e a
  lista de sessões daquela campanha.
- **RF2.** Usuário cria um NPC informando ao menos o nome.
- **RF3.** Usuário edita um NPC existente (nome, descrição, motivação, status,
  imagem_url).
- **RF4.** Usuário exclui um NPC, com confirmação.
- **RF5.** Usuário cria uma sessão informando ao menos a data.
- **RF6.** Usuário edita uma sessão existente (data, resumo, notas).
- **RF7.** Usuário exclui uma sessão, com confirmação.
- **RF8.** NPCs e sessões de uma campanha nunca aparecem em outra campanha,
  nem em campanhas de outro usuário.
- **RF9.** Acessar `/dashboard/[id]` de uma campanha que não existe ou não é
  sua resulta em 404 (mesmo comportamento já usado em `/dashboard/[id]/editar`
  na Onda 1).

## 5. Critérios de aceitação

A onda só está pronta quando **todos** forem verdadeiros:

- [ ] RLS habilitado em `npc` e `sessao`, confirmado no painel do Supabase.
- [ ] Crio um NPC numa campanha e ele aparece na lista dela.
- [ ] Edito um NPC e a mudança persiste após recarregar.
- [ ] Excluo um NPC (com confirmação) e ele some da lista.
- [ ] Crio, edito e excluo uma sessão, com o mesmo comportamento.
- [ ] NPCs/sessões de uma campanha não aparecem em outra campanha.
- [ ] Acessar a campanha de outro usuário (ou um id inexistente) dá 404.

## 6. Decisões técnicas

- **Rota de detalhe:** `/dashboard/[id]` passa a ser a página de uma campanha
  específica (nome/sistema/sinopse + seções de NPCs e Sessões). O link
  "Editar" da Onda 1 continua existindo, mas o nome da campanha na listagem
  passa a linkar para `/dashboard/[id]`.
- **Rotas de criação/edição:** seguindo o padrão já usado em campanha —
  `/dashboard/[id]/npcs/novo`, `/dashboard/[id]/npcs/[npcId]/editar`,
  `/dashboard/[id]/sessoes/novo`, `/dashboard/[id]/sessoes/[sessaoId]/editar`.
- **RLS em tabela-filha:** como `npc`/`sessao` não têm `user_id` direto, a
  policy usa uma subquery contra `campanha`:
  `exists (select 1 from campanha where campanha.id = npc.campanha_id and campanha.user_id = auth.uid())`
  (mesma ideia para `sessao`).
- **`status` do NPC:** `enum` nativo do Postgres (`vivo`, `morto`,
  `desaparecido`, `aliado`, `inimigo`), conforme `PRD.md` §5. No formulário,
  vira um `<select>` (componente `Select` do shadcn/ui), com `vivo` como
  padrão.
- **Formulários e mutações:** mesmo padrão da Onda 1 — Server Actions,
  `useActionState`, validação simples sem Zod, componente de formulário
  reutilizável por entidade (`NpcForm`, `SessaoForm`).

## 7. Tarefas sugeridas (ordem para o agente)

1. Escrever a migration SQL (tabelas `npc` com enum de status, e `sessao`,
   ambas com RLS via join em `campanha`).
2. **[VOCÊ]** Rodar essa migration no SQL Editor do Supabase.
3. Criar a página `/dashboard/[id]` (detalhe da campanha, 404 se não for sua).
4. Server Actions de NPC (criar/editar/excluir) + listagem e formulário.
5. Server Actions de sessão (criar/editar/excluir) + listagem e formulário.
6. Verificar os critérios de aceitação da seção 5.

## 8. Como usar esta spec no Claude Code

- Tenha `PRD.md`, `docs/specs/onda-1.md` (para não regredir o que já existe)
  e este arquivo como contexto.
- A tarefa 2 é sua — o agente para ali e espera você confirmar que rodou a
  migration antes de seguir.
- Se o agente quiser fazer algo da lista "Fora" (seção 2), aponte para ela.
