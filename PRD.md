# PRD — Mesa do Mestre

> Documento de visão do produto. Serve como contexto raiz para o desenvolvimento
> assistido por agente (Claude Code). Cada feature listada aqui é detalhada
> separadamente em sua própria spec (`docs/specs/<feature>.md`).

## 1. Visão

Um companion web para mestres de RPG de mesa gerenciarem suas campanhas:
NPCs, sessões e um auxílio de criação de conteúdo com IA. O objetivo é tirar
da cabeça (e dos cadernos espalhados) o material de campanha e deixá-lo
organizado, pesquisável e acessível durante a sessão.

## 2. Problema

Mestres acumulam NPCs, ganchos de história e anotações de sessão em formatos
dispersos (papel, blocos de notas, planilhas). Falta um lugar único, por
campanha, que seja rápido de consultar na hora do jogo e fácil de alimentar
antes dele.

## 3. Usuário-alvo

Mestre de RPG de mesa (D&D, Tormenta, Call of Cthulhu, etc.) que prepara e
conduz campanhas. Uso individual: cada mestre vê apenas as suas campanhas.

## 4. Stack

- **Frontend:** Next.js (App Router) + shadcn/ui
- **Backend / Dados / Auth:** Supabase (Postgres + Auth + Storage)
- **Versionamento:** GitHub
- **Deploy:** Vercel
- **IA:** API da Anthropic (geração de NPC; análise de imagem)

## 5. Modelo de dados

```
usuario (gerenciado pelo Supabase Auth)
  └── campanha        (id, user_id, nome, sistema, sinopse, created_at)
        ├── npc       (id, campanha_id, nome, descricao, motivacao,
        │              status, imagem_url, created_at)
        └── sessao    (id, campanha_id, data, resumo, notas, created_at)
```

Regras:
- Toda campanha pertence a um usuário (`user_id`).
- NPC e sessão pertencem a uma campanha (`campanha_id`).
- Row Level Security (RLS): cada usuário só acessa os próprios dados.
- `status` do NPC é um enum: `vivo`, `morto`, `desaparecido`, `aliado`, `inimigo`.

## 6. Features (entregues em ondas)

### Onda 0 — Esqueleto + ciclo de deploy
Projeto Next.js, login/logout via Supabase Auth, deploy na Vercel.
Critério de pronto: app rodando em URL pública mostrando o email do usuário logado.

### Onda 1 — CRUD de Campanha
Criar, listar, editar e excluir campanhas do usuário logado.
Critério de pronto: usuário gerencia o ciclo de vida completo de uma campanha.

### Onda 2 — NPCs e Sessões
CRUD das entidades-filhas dentro de uma campanha, respeitando a relação.
Critério de pronto: dentro de uma campanha, o usuário gerencia NPCs e sessões.

### Onda 3 — Gerador de NPC com IA
Botão "Gerar NPC" com um prompt curto (ex: "taverneiro suspeito, cidade
portuária"). A IA retorna nome, descrição, motivação e status sugeridos,
que o usuário revisa antes de salvar.
Critério de pronto: NPC gerado pela IA pode ser editado e salvo como NPC real.

### Onda 4 — Imagem como contexto
Upload de imagem (mapa, ficha, recorte). A IA analisa e sugere NPCs ou notas
a partir dela.
Critério de pronto: a partir de uma imagem, o usuário cria pelo menos um NPC.

## 7. Fora de escopo (por enquanto)

- Compartilhamento de campanha entre múltiplos mestres.
- Visão de jogador / portal do jogador.
- Rolagem de dados e regras de sistema.
- Tracker de combate em tempo real (candidato a versão futura).
- App mobile nativo.

## 8. Critérios de sucesso

- O mestre consegue, antes da sessão, cadastrar campanha, NPCs e notas.
- Durante a sessão, encontra qualquer NPC ou resumo em poucos segundos.
- A geração por IA economiza tempo de preparação sem substituir a curadoria
  do mestre (sempre há etapa de revisão antes de salvar).
