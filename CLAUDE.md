# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

**Project scope is closed at Onda 3.** The user explicitly decided not to build anything beyond
what's listed in `PRD.md` §6 (Ondas 0–3) — Onda 4 ("Imagem como contexto") and anything further is
out of scope (`PRD.md` §7), not just deferred. Do not propose, plan, or start a new wave; if asked
"what's next", the answer is bug fixes / polish on Ondas 0–3, not new features.

Ondas 0–3 are all **code-complete** and deployed: Supabase project created, `.env.local` filled in,
app live on Vercel (deployment protection disabled so it's actually public). Login uses a 6-digit
**email OTP** (`src/components/login-form.tsx`, calls `signInWithOtp`/`verifyOtp`) — not magic
link; there is no `/auth/confirm` route, it was removed when the flow changed. `/dashboard` lists
the user's campanhas (Onda 1); `/dashboard/[id]` is a campanha's detail page with NPC/sessão CRUD
(Onda 2); NPC creation has an AI-assisted "Gerar com IA" panel (Onda 3, `src/app/dashboard/[id]/npc-ai-actions.ts`,
Anthropic SDK, `claude-sonnet-4-6`, structured output via Zod).

**Known blocker (as of last session):** the Supabase OTP email's default template doesn't include
`{{ .Token }}`, so the code never reaches the user, and the project's default email service is
capped at 2 emails/hour — both need fixing in the Supabase dashboard (Authentication → Email
Templates → Magic Link, add `{{ .Token }}`) before the login flow (and therefore Ondas 1–3's
acceptance criteria) can be verified end-to-end live. Check whether this has been resolved before
assuming it's still blocking.

See `AGENTS.md` before writing any Next.js code — this project was bootstrapped on a very recent
Next.js/React version with breaking changes relative to older conventions (e.g. Middleware was
renamed to **Proxy** in Next.js 16 — `src/proxy.ts`, not `middleware.ts`). The shadcn/ui setup here
uses **Base UI**, not Radix — polymorphic rendering is `<Button render={<Link .../>}>` not
`asChild`. Consult `node_modules/next/dist/docs/` rather than assuming prior knowledge still
applies, and re-verify current docs (Supabase, Anthropic) before touching auth or AI code — key
naming, recommended session-check APIs, model IDs, etc. have all changed mid-project already.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint

No test runner is configured yet.

## Document hierarchy

- `PRD.md` — root product vision/context for the whole project. Read this first for the big
  picture (problem, target user, stack, data model, feature roadmap — note §6/§7: scope ends at
  Onda 3, no Onda 4).
- `docs/specs/onda-0.md` through `onda-3.md` — all four waves, all implemented. Read these for
  established conventions (RLS policy shape, Server Action patterns, route structure) before
  inventing new ones; this is the full feature set, not a partial history.
- There will be no `onda-4.md`. Work from here is fixes/polish within Ondas 0–3, not new waves.

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

- **Frontend:** Next.js (App Router) + shadcn/ui (Base UI variant)
- **Backend/Data/Auth:** Supabase (Postgres + Auth + Storage), with Row Level Security so each
  user only sees their own data
- **AI:** Anthropic API (`@anthropic-ai/sdk`), for NPC generation only — no image analysis (that
  was the dropped Onda 4)
- **Deploy:** Vercel, connected to a GitHub repo

Data model (fully implemented):

```
usuario (Supabase Auth)
  └── campanha   (id, user_id, nome, sistema, sinopse, created_at)
        ├── npc     (id, campanha_id, nome, descricao, motivacao,
        │            status, imagem_url, created_at)
        └── sessao  (id, campanha_id, data, resumo, notas, created_at)
```

`npc.status` is an enum: `vivo`, `morto`, `desaparecido`, `aliado`, `inimigo`. Every `campanha`
belongs to one `user_id`; `npc` and `sessao` belong to one `campanha_id`. Migrations live in
`supabase/migrations/`, applied manually by the user in the Supabase SQL Editor (the app's
publishable key can't run DDL) — agent work that depends on a table existing should wait for the
user's confirmation that they ran the migration before proceeding.
