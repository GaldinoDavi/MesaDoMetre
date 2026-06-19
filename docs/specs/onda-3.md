# Spec — Onda 3: Gerador de NPC com IA

> Spec de feature derivada do `PRD.md`. Pressupõe a Onda 2 concluída (CRUD de
> NPC dentro de uma campanha). Não introduz nenhuma tabela nova — só consome a
> API da Anthropic para sugerir valores que o usuário revisa e salva pelo
> fluxo de criação de NPC que já existe.

## 1. Objetivo

Na tela de criação de NPC, o usuário descreve o NPC em uma frase curta (ex:
"taverneiro suspeito, cidade portuária") e a IA sugere nome, descrição,
motivação e status. O usuário revisa e edita livremente antes de salvar — a
IA nunca salva nada diretamente.

## 2. Escopo

### Dentro
- Botão/campo "Gerar com IA" na página `/dashboard/[id]/npcs/novo`.
- Server Action que chama a API da Anthropic e retorna nome, descrição,
  motivação e status sugeridos, em formato estruturado (não texto livre).
- Os campos sugeridos pré-enchem o formulário de NPC já existente (Onda 2);
  o usuário pode editar qualquer campo antes de clicar em "Criar NPC".
- Tratamento de erro claro se a geração falhar (chave ausente, API fora,
  resposta inválida).

### Fora (não fazer nesta onda)
- Geração/análise de imagem — Onda 4.
- Regenerar campos individualmente (só "gerar tudo de novo" por enquanto).
- Rate limiting ou proteção contra abuso do botão — uso é individual
  (`PRD.md`), risco baixo nesse estágio.
- Qualquer mudança no CRUD de NPC em si (Onda 2) além de pré-popular o form.

## 3. Pré-requisitos — o que VOCÊ faz pessoalmente

1. Criar uma API key em console.anthropic.com.
2. Colocar essa chave em `ANTHROPIC_API_KEY` no seu `.env.local` (veja
   `.env.local.example`) e, depois, nas variáveis de ambiente da Vercel.
   **Nunca** com prefixo `NEXT_PUBLIC_` — essa chave só pode ser usada no
   servidor.

## 4. Requisitos funcionais

- **RF1.** Usuário digita um prompt curto e clica em "Gerar"; em poucos
  segundos os campos do formulário de NPC (nome, descrição, motivação,
  status) são preenchidos com a sugestão da IA.
- **RF2.** Usuário pode editar qualquer campo sugerido antes de salvar.
- **RF3.** Salvar usa o mesmo fluxo de criação de NPC já existente (Onda 2) —
  nenhuma rota ou Server Action de salvamento nova.
- **RF4.** Se a geração falhar (erro de rede, API, chave ausente), uma
  mensagem clara aparece e o formulário continua vazio/editável manualmente.
- **RF5.** O usuário também pode ignorar a IA e preencher o formulário à mão,
  como já era possível na Onda 2.

## 5. Critérios de aceitação

- [ ] Digito um prompt curto, clico em "Gerar" e os campos do formulário são
      preenchidos com a sugestão.
- [ ] Edito um campo sugerido e o valor editado é o que é salvo.
- [ ] O NPC gerado e revisado é salvo como NPC real, aparecendo na lista.
- [ ] Sem `ANTHROPIC_API_KEY` configurada, o botão mostra um erro
      compreensível em vez de quebrar a página.

## 6. Decisões técnicas

- **Modelo:** `claude-sonnet-4-6` — bom equilíbrio para gerar um perfil curto
  de NPC a partir de um prompt curto, com custo bem menor que o Opus.
- **SDK:** `@anthropic-ai/sdk` (pacote oficial Node.js), chave lida de
  `ANTHROPIC_API_KEY` no servidor.
- **Saída estruturada:** `client.messages.parse()` com `output_config.format`
  usando um schema Zod (`zodOutputFormat()`), em vez de pedir "responda em
  JSON" no prompt e fazer parsing manual — mais confiável e já validado pelo
  SDK.
- **Sem persistência da sugestão:** a IA não grava nada no banco; o
  resultado só existe no estado do formulário até o usuário clicar em
  "Criar NPC" (que usa o `createNpc` já existente da Onda 2).
- **Integração de UI:** novo componente cliente (`NpcCreatePanel`) que
  envolve o `NpcForm` já existente, gerenciando o prompt e o resultado da IA
  como estado local; o `NpcForm` é remontado (via `key`) quando uma nova
  sugestão chega, para refletir os novos valores padrão nos campos.

## 7. Tarefas sugeridas (ordem para o agente)

1. Instalar `@anthropic-ai/sdk` e `zod`; adicionar `ANTHROPIC_API_KEY` ao
   `.env.local.example`.
2. **[VOCÊ]** Criar a API key na Anthropic e preencher `.env.local`.
3. Implementar a Server Action `generateNpc` com saída estruturada via Zod.
4. Implementar o componente `NpcCreatePanel` e integrá-lo na página de
   criação de NPC.
5. Verificar os critérios de aceitação da seção 5 (depende da chave real
   estar configurada e do login estar liberado).

## 8. Como usar esta spec no Claude Code

- Tenha `PRD.md` e `docs/specs/onda-2.md` (para reaproveitar o `NpcForm` e o
  `createNpc` já existentes) como contexto.
- A tarefa 2 é sua — o agente pode escrever o código das tarefas 3–4 mesmo
  sem a chave real configurada, mas não consegue testar a geração de verdade
  até você configurar.
