# Spec — Onda 1: CRUD de Campanha

> Spec de feature derivada do `PRD.md`. Pressupõe a Onda 0 concluída (login/logout
> via Supabase Auth funcionando, rota `/dashboard` protegida). Introduz a primeira
> entidade de domínio: `campanha`.

## 1. Objetivo

Cada usuário autenticado consegue criar, listar, editar e excluir suas próprias
campanhas. Esta é a base sobre a qual NPCs e sessões (Onda 2) serão encaixados.

Resultado esperado: ao entrar em `/dashboard`, o usuário vê a lista das suas
campanhas (ou um estado vazio, se ainda não tiver nenhuma), pode criar uma nova,
editar os dados de uma existente e excluir a que não quiser mais — sem nunca ver
ou conseguir acessar campanhas de outro usuário.

## 2. Escopo

### Dentro
- Tabela `campanha` no Postgres do Supabase (`id`, `user_id`, `nome`, `sistema`,
  `sinopse`, `created_at`), com Row Level Security restringindo todo acesso ao
  próprio `user_id`.
- Listagem das campanhas do usuário logado.
- Criação de campanha (`nome` obrigatório; `sistema` e `sinopse` opcionais).
- Edição de uma campanha existente.
- Exclusão de uma campanha, com confirmação antes de excluir.
- Estado vazio amigável quando o usuário ainda não tem campanhas.

### Fora (não fazer nesta onda)
- NPCs e sessões (entidades-filhas de campanha) — Onda 2.
- Geração de conteúdo por IA — Onda 3+.
- Compartilhamento de campanha entre múltiplos mestres (fora de escopo geral do
  produto, ver `PRD.md` §7).
- Busca, filtros ou paginação na listagem (poucas campanhas por usuário neste
  estágio; revisitar se vier a ser necessário).
- Qualquer mudança no fluxo de autenticação da Onda 0.

## 3. Pré-requisitos — o que VOCÊ faz pessoalmente

1. Supabase já configurado com URL e Publishable Key em `.env.local` (pré-requisito
   da Onda 0 — confirme que está feito antes de começar aqui).
2. Rodar, no **SQL Editor** do seu projeto Supabase, a migration que o agente vai
   preparar (tabela `campanha` + policies de RLS). Isso exige acesso ao painel do
   projeto, por isso não é delegado ao agente — a chave pública (`anon`/`publishable`)
   usada pelo app não tem permissão para alterar o schema do banco.

> O agente escreve o SQL e os componentes; você cola e roda a migration no painel
> do Supabase.

## 4. Requisitos funcionais

- **RF1.** Usuário autenticado vê, em `/dashboard`, a lista de campanhas onde
  `user_id` é o seu — nunca campanhas de outro usuário.
- **RF2.** Usuário cria uma campanha informando ao menos o nome; ela aparece
  imediatamente na lista.
- **RF3.** Usuário edita nome, sistema e/ou sinopse de uma campanha existente; a
  mudança persiste e reflete na lista.
- **RF4.** Usuário exclui uma campanha após confirmar a ação; ela desaparece da
  lista.
- **RF5.** Se o usuário não tiver nenhuma campanha, a lista mostra uma mensagem
  de estado vazio (não uma lista quebrada ou em branco sem explicação).
- **RF6.** Tentar acessar `/dashboard` sem sessão válida continua redirecionando
  para `/login` (comportamento da Onda 0, não deve regredir).

## 5. Critérios de aceitação

A onda só está pronta quando **todos** forem verdadeiros:

- [ ] RLS está habilitado na tabela `campanha` (confirmado no painel do Supabase).
- [ ] Crio uma campanha pelo formulário e ela aparece na lista.
- [ ] Edito uma campanha e a mudança persiste após recarregar a página.
- [ ] Excluo uma campanha (com confirmação) e ela some da lista.
- [ ] Login com um segundo usuário (ou aba anônima) não mostra as campanhas do
      primeiro usuário.
- [ ] Sem sessão, `/dashboard` continua redirecionando para `/login`.

## 6. Decisões técnicas

- **Onde mora a listagem:** `/dashboard` (já protegida desde a Onda 0) passa a
  ser a tela de campanhas, em vez do placeholder "logado como email + sair" atual.
  O email do usuário e o botão de logout continuam visíveis, só deixam de ser o
  conteúdo principal da página.
- **Mutações:** Server Actions do Next.js (`"use server"`) para criar, editar e
  excluir — sem API routes separadas, seguindo o padrão atual do App Router já
  usado no fluxo de auth da Onda 0.
- **Validação:** checagem simples no server action (nome não pode ser vazio) sem
  introduzir uma lib de schema (Zod etc.) ainda — poucos campos, baixo risco. Se
  os formulários crescerem nas próximas ondas (Onda 2 com enum de status do NPC,
  Onda 3 com inputs de IA), reavaliar.
- **RLS:** policies separadas de `select`/`insert`/`update`/`delete` na tabela
  `campanha`, todas restringindo por `user_id = auth.uid()`. `user_id` é
  preenchido no insert a partir da sessão do servidor, nunca recebido do cliente.
- **Migration:** entregue como arquivo SQL versionado no repo (em
  `supabase/migrations/`), para ficar documentada mesmo sendo aplicada manualmente
  por você no painel.

## 7. Tarefas sugeridas (ordem para o agente)

1. Escrever a migration SQL (tabela `campanha` + RLS) em `supabase/migrations/`.
2. **[VOCÊ]** Rodar essa migration no SQL Editor do Supabase.
3. Implementar os Server Actions de criar/editar/excluir campanha (com checagem
   de sessão server-side em cada um).
4. Transformar `/dashboard` na listagem de campanhas do usuário, com estado
   vazio quando não houver nenhuma.
5. Implementar o formulário de criação de campanha.
6. Implementar a edição de uma campanha existente.
7. Implementar a exclusão com confirmação.
8. Verificar os critérios de aceitação da seção 5 (a tarefa 1 dali em diante só
   pode ser validada de ponta a ponta depois que você rodar a migration).

## 8. Como usar esta spec no Claude Code

- Tenha `PRD.md`, `docs/specs/onda-0.md` (para não regredir o que já existe) e
  este arquivo como contexto.
- A tarefa 2 é sua — o agente para ali e espera você confirmar que rodou a
  migration antes de seguir para as tarefas que dependem da tabela existir.
- Se o agente quiser fazer algo da lista "Fora" (seção 2), aponte para ela.
