# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

Onda 0 and Onda 1 are both **code-complete** and deployed: Supabase project created, `.env.local`
filled in, app live on Vercel (deployment protection disabled so it's actually public). Login uses
a 6-digit **email OTP** (`src/components/login-form.tsx`, calls `signInWithOtp`/`verifyOtp`) —
not magic link; there is no `/auth/confirm` route, it was removed when the flow changed.
`/dashboard` lists the logged-in user's campanhas (Onda 1 CRUD, `src/app/dashboard/`).

**Known blocker (as of last session):** the Supabase OTP email's default template doesn't include
`{{ .Token }}`, so the code never reaches the user, and the project's default email service is
capped at 2 emails/hour — both need fixing in the Supabase dashboard (Authentication → Email
Templates → Magic Link, add `{{ .Token }}`) before the login flow can be verified end-to-end. This
was deferred by the user to a later session; check whether it's been resolved before assuming
login still doesn't work.

`docs/specs/onda-2.md` (NPCs e Sessões) is drafted and ready for review, not yet started — don't
write its migration/code until the user explicitly says to proceed.

See `AGENTS.md` before writing any Next.js code — this project was bootstrapped on a very recent
Next.js/React version with breaking changes relative to older conventions (e.g. Middleware was
renamed to **Proxy** in Next.js 16 — `src/proxy.ts`, not `middleware.ts`). The shadcn/ui setup here
uses **Base UI**, not Radix — polymorphic rendering is `<Button render={<Link .../>}>` not
`asChild`. Consult `node_modules/next/dist/docs/` rather than assuming prior knowledge still
applies, and re-verify current Supabase docs before touching auth code (key naming, recommended
session-check APIs, etc. have all changed mid-project already).

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint

No test runner is configured yet.

## Document hierarchy

- `PRD.md` — root product vision/context for the whole project. Read this first for the big
  picture (problem, target user, stack, data model, feature roadmap).
- `docs/specs/onda-0.md`, `onda-1.md` — completed waves (skeleton+auth, campanha CRUD). Read these
  for established conventions (RLS policy shape, Server Action patterns, route structure) before
  inventing new ones. `docs/specs/onda-2.md` is the next wave, drafted but not started.
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

Data model:

```
usuario (Supabase Auth)
  └── campanha   (id, user_id, nome, sistema, sinopse, created_at)   -- implemented, Onda 1
        ├── npc     (id, campanha_id, nome, descricao, motivacao,
        │            status, imagem_url, created_at)                 -- planned, Onda 2
        └── sessao  (id, campanha_id, data, resumo, notas, created_at) -- planned, Onda 2
```

`npc.status` is an enum: `vivo`, `morto`, `desaparecido`, `aliado`, `inimigo`. Every `campanha`
belongs to one `user_id`; `npc` and `sessao` will belong to one `campanha_id`. Migrations live in
`supabase/migrations/`, applied manually by the user in the Supabase SQL Editor (the app's
publishable key can't run DDL) — agent work that depends on a table existing should wait for the
user's confirmation that they ran the migration before proceeding.

## Current wave: Onda 2 (NPCs e Sessões), drafted

Per `docs/specs/onda-2.md`: a new `/dashboard/[id]` page becomes the campanha detail view (NPCs +
sessões lists), with `npc`/`sessao` tables RLS-scoped via a subquery against `campanha.user_id`
(they have no `user_id` column of their own). Follow the Server Action / form patterns already
established in `src/app/dashboard/actions.ts` and `src/components/campanha-form.tsx`.
