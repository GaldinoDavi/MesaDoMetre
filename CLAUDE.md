# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

The Next.js project has been scaffolded (Onda 0, tarefa 1) but auth/Supabase/domain code does not
exist yet. See `AGENTS.md` before writing any Next.js code — this project was bootstrapped on a
very recent Next.js/React version with breaking changes relative to older conventions; consult
`node_modules/next/dist/docs/` rather than assuming prior knowledge still applies.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint

No test runner is configured yet.

## Document hierarchy

- `PRD.md` — root product vision/context for the whole project. Read this first for the big
  picture (problem, target user, stack, data model, feature roadmap).
- `docs/specs/onda-0.md` — detailed spec for the current feature wave ("Onda 0": skeleton + deploy
  cycle). Future waves get their own spec file under `docs/specs/<feature>.md` (per the convention
  stated in `PRD.md`), derived from the PRD.
- Work is organized in **ondas** (waves), each with its own spec, scope ("Dentro"/"Fora"), and
  acceptance criteria. Do not start the next wave's spec until the current one's acceptance
  criteria are all checked off.

## How to work in this repo

- Treat `PRD.md` + the active wave's spec file as the source of truth for scope. If asked to do
  something listed under that spec's "Fora" (out of scope) section, point it out instead of doing
  it silently.
- Specs list "Tarefas sugeridas" (suggested tasks) in order — work through them **one at a time**
  and let the user validate before moving to the next, rather than batching everything at once.
- Some steps are explicitly reserved for the human (creating accounts, Supabase/Vercel projects,
  pasting credentials/API keys, connecting GitHub↔Vercel). The agent prepares code/config; it does
  not and cannot perform those account/credential steps.
- Before adding Supabase integration code, consult the current official Supabase docs for Next.js
  App Router SSR — the spec deliberately avoids pinning package names/versions because they change
  over time.
- Never commit `.env.local` or any file containing Supabase keys; ensure `.gitignore` covers it
  once the project is bootstrapped.

## Planned architecture (from PRD.md)

- **Frontend:** Next.js (App Router) + shadcn/ui
- **Backend/Data/Auth:** Supabase (Postgres + Auth + Storage), with Row Level Security so each
  user only sees their own data
- **AI:** Anthropic API, for NPC generation and image analysis (later waves)
- **Deploy:** Vercel, connected to a GitHub repo

Planned data model (not yet implemented):

```
usuario (Supabase Auth)
  └── campanha   (id, user_id, nome, sistema, sinopse, created_at)
        ├── npc     (id, campanha_id, nome, descricao, motivacao,
        │            status, imagem_url, created_at)
        └── sessao  (id, campanha_id, data, resumo, notas, created_at)
```

`npc.status` is an enum: `vivo`, `morto`, `desaparecido`, `aliado`, `inimigo`. Every `campanha`
belongs to one `user_id`; `npc` and `sessao` belong to one `campanha_id`.

## Current wave: Onda 0 (skeleton + deploy)

Per `docs/specs/onda-0.md`, this wave has **no domain entities** (no campanha/npc/sessao CRUD, no
custom tables) — it only proves the Supabase → GitHub → Vercel pipeline end to end. Tasks are
being executed one at a time, in the order listed in that spec's §7, each validated before moving
to the next:

- Initialize Next.js (App Router, TypeScript) + shadcn/ui. ✅ Next.js part done; shadcn/ui pending.
- Configure Supabase clients for both server and browser, reading env vars.
- Auth: magic link (passwordless email) is the default choice; email+password is acceptable only
  if explicitly chosen instead — record the choice in the spec before building it.
- Route protection must happen **server-side** (middleware or Server Component session check),
  not by hiding elements client-side only.
- One public route (`/login`) and one protected route (e.g. `/app` or `/dashboard`) showing the
  logged-in user's email plus a logout button.
