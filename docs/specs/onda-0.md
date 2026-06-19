# Spec — Onda 0: Esqueleto + Ciclo de Deploy

> Spec de feature derivada do `PRD.md`. Define o primeiro incremento entregável:
> uma aplicação Next.js com autenticação Supabase, rodando publicamente na Vercel.
> Não há nenhuma entidade de domínio (campanha, NPC, sessão) ainda — isso é Onda 1+.

## 1. Objetivo

Fechar o ciclo completo de infraestrutura **Supabase → GitHub → Vercel** com o
mínimo de código possível, provando que a autenticação funciona ponta a ponta.

Resultado esperado: ao acessar a URL pública do projeto na Vercel, um visitante
não autenticado é levado ao login; após autenticar, ele vê uma página simples
exibindo o próprio email e um botão de logout.

## 2. Escopo

### Dentro
- Projeto Next.js (App Router) inicializado.
- shadcn/ui configurado (para os componentes de UI).
- Cliente Supabase configurado para uso no servidor e no cliente.
- Autenticação por email (login e logout).
- Uma rota protegida (`/app` ou `/dashboard`) que exige sessão válida.
- Redirecionamento de não autenticados para a página de login.
- Repositório no GitHub.
- Deploy na Vercel com variáveis de ambiente configuradas.

### Fora (não fazer nesta onda)
- Qualquer CRUD de domínio (campanha, NPC, sessão).
- Tabelas de dados próprias além do que o Supabase Auth já cria.
- Estilização elaborada, tema, layout de produto.
- Recuperação de senha, perfis de usuário, OAuth de terceiros (Google etc.).
- Row Level Security de entidades (virá quando houver entidades, na Onda 1).

## 3. Pré-requisitos — o que VOCÊ faz pessoalmente

Estas etapas envolvem contas e credenciais e **não** são delegadas ao agente:

1. Ter Node.js instalado localmente.
2. Criar uma conta e um **projeto** no Supabase.
3. No projeto Supabase, em *Authentication*, habilitar login por email.
4. Copiar do projeto Supabase: a **Project URL** e a **anon/public key**.
5. Ter conta no GitHub e na Vercel.
6. Colocar as chaves do Supabase em um arquivo `.env.local` (local) e, depois,
   nas *Environment Variables* da Vercel. **Nunca** commitar o `.env.local`.

> O agente escreve o código e pode te orientar nesses passos, mas quem clica,
> cria contas e insere credenciais é você.

## 4. Requisitos funcionais

- **RF1.** Visitante não autenticado que acessa qualquer rota protegida é
  redirecionado para `/login`.
- **RF2.** Na página de login, o usuário informa o email e recebe acesso por
  email (magic link). *(Alternativa: email + senha, se preferir — ver seção 6.)*
- **RF3.** Após autenticar, o usuário é levado à rota protegida.
- **RF4.** A rota protegida exibe o email do usuário logado.
- **RF5.** Há um botão de logout que encerra a sessão e retorna para `/login`.
- **RF6.** A sessão persiste entre recarregamentos de página.

## 5. Critérios de aceitação

A onda só está pronta quando **todos** forem verdadeiros:

- [ ] Acessar a rota protegida sem login redireciona para `/login`.
- [ ] Consigo me autenticar com meu email.
- [ ] Após autenticar, vejo meu email na tela.
- [ ] O botão de logout funciona e me devolve ao `/login`.
- [ ] Recarregar a página mantém a sessão.
- [ ] O app está acessível numa URL pública da Vercel.
- [ ] O repositório está no GitHub e o `.env.local` **não** foi commitado
      (deve estar no `.gitignore`).

## 6. Decisões técnicas

- **Método de auth:** começar com **magic link** (login por email sem senha).
  Tem menos atrito e evita lidar com fluxo de redefinição de senha nesta fase.
  Se preferir email + senha por familiaridade, é aceitável — só registre a
  escolha aqui antes de começar.
- **Integração Supabase + Next.js:** usar a abordagem oficial atual de SSR do
  Supabase para o App Router. **Instrua o agente a consultar a documentação
  oficial atual do Supabase** antes de instalar pacotes, pois os nomes e as
  versões recomendadas mudam com o tempo. Não fixe versões nesta spec.
- **Estrutura mínima:** uma rota pública (`/login`) e uma rota protegida.
  A proteção de rota deve ocorrer no servidor (middleware ou verificação de
  sessão no Server Component), não apenas escondendo elementos no cliente.
- **Variáveis de ambiente:** a URL e a anon key do Supabase entram como
  variáveis de ambiente (prefixo público onde a chave for usada no cliente).

## 7. Tarefas sugeridas (ordem para o agente)

1. Inicializar o projeto Next.js (App Router, TypeScript).
2. Configurar o shadcn/ui.
3. Configurar os clientes Supabase (servidor e navegador) lendo as variáveis
   de ambiente.
4. Implementar o controle de sessão / proteção de rota no servidor.
5. Criar a página `/login` com o fluxo de magic link.
6. Criar a rota protegida que exibe o email do usuário e o botão de logout.
7. Configurar `.gitignore` (garantindo que `.env.local` está ignorado) e
   subir o repositório para o GitHub.
8. Conectar o repositório à Vercel, configurar as variáveis de ambiente e
   fazer o deploy.

> Importante: as tarefas 7 e 8 envolvem ações suas (criar repo, conectar
> contas, inserir credenciais na Vercel). O agente prepara os arquivos; você
> executa a parte de contas e credenciais.

## 8. Como usar esta spec no Claude Code

- Tenha o `PRD.md` e este arquivo disponíveis como contexto.
- Trabalhe **uma tarefa da seção 7 por vez**; valide antes de seguir.
- Ao concluir, marque os itens da seção 5 e só então abra a spec da Onda 1.
- Se o agente quiser fazer algo da lista "Fora" (seção 2), aponte para ela.
