# DigiHome FE

Chat frontend for DigiHome — smart-home assistant. Single-thread chat with history, PDF upload (RAG), and document sync.

## Stack

React 19 + TypeScript + Vite, Tailwind v4, shadcn/base-nova, TanStack Query, React Router, redaxios.

## Features

- Chat — `useInfiniteQuery` history (`GET /chat?before=`), `POST /chat {prompt}` with optimistic update, infinite scroll (IntersectionObserver)
- Documents — PDF dropzone (max 10, preview), `POST /rag/document`, `POST /rag/seed` sync
- Theme — light / dark / system, persisted, applied via `html.dark` (dropdown in header)

## Get Started

```bash
cp .env.example .env   # set VITE_API_URL (default http://localhost:8080)
bun install            # respects bunfig.toml minimumReleaseAge=3d
bun dev                # http://localhost:5173
```

### Tooling setup (one-time)

```bash
# Git hooks — prettier on pre-commit, tsc --noEmit on pre-push (see prek.toml)
bunx prek install              # install hooks
bunx prek run --all-files      # run all hooks manually

# shadcn — add UI components (alias @/* → src/* is pre-configured)
bunx shadcn@latest add button dialog sonner  # etc.

# Alternatives if you don't use prek
bunx prettier --write .        # format (semi: false)
bunx tsc --noEmit              # typecheck
bun run lint                   # oxlint
```

## Scripts

| Command                     | Description                      |
| --------------------------- | -------------------------------- |
| `bun dev`                   | dev server                       |
| `bun run build`             | `tsc -b && vite build`           |
| `bun run lint`              | oxlint (config `.oxlintrc.json`) |
| `bunx tsc --noEmit`         | typecheck                        |
| `bunx prettier --write .`   | format (no semicolons)           |
| `bunx prek run --all-files` | all hooks (prettier + tsc)       |

## Env

Only `VITE_API_URL` required (Vite needs `VITE_` prefix). See `.env.example`.

## Project Structure

```
src/main.tsx → app/providers.tsx → routes/router.tsx
pages/home.tsx, hooks/home/useHomePage.ts
components/home/{ChatBubble, dropzone/DocumentDropzone, modal/InsertDocumentModal, button/SyncDocumentsButton}
components/theme/{theme-provider, theme-toggle}
components/ui/* (shadcn), lib/*, api/*, schemas/*
```

## Notes

- Alias `@/*` → `src/*`
- `FormData` uploads must not set `Content-Type` manually (let browser set boundary)
- Tailwind theme in `src/index.css`, dark mode via `@custom-variant dark (&:is(.dark *))`
