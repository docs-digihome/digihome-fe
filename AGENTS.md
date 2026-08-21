# AGENTS.md

React 19 + TypeScript + Vite SPA (digihome-fe). Package manager is **bun** (`bun.lock`, `bunfig.toml` with `minimumReleaseAge=259200` — may block `bun add` of latest packages); do not use npm/yarn/pnpm.

## Commands

- `bun dev` — dev server
- `bun run build` — `tsc -b && vite build` (type errors fail build)
- `bun run lint` — **oxlint** (not eslint, config `.oxlintrc.json`)
- `bunx prettier --write <files>` — formatter (`semi: false`)
- `bunx tsc --noEmit` — typecheck (also pre-push hook)
- `bunx prek run --all-files` — run all hooks; install with `bunx prek install`
- No test framework configured

Prek (`prek.toml`): prettier on `pre-commit`, `tsc --noEmit` on `pre-push`.

## Conventions

- **No semicolons** (`prettierrc` `semi: false`). `verbatimModuleSyntax` on — use `import type` for types
- Strict `tsconfig.app.json`: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- Path alias `@/*` → `./src/*` (vite + tsconfig)
- Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config`; theme in `src/index.css` (`@custom-variant dark`, `@plugin "@tailwindcss/typography"`, `base-nova` shadcn style). Add components with `bunx shadcn@latest add <name>` (aliases in `components.json`)

## Architecture

- `src/main.tsx` → `src/app/providers.tsx` (QueryClientProvider + sonner Toaster) → `src/routes/router.tsx` (`createBrowserRouter`, `/` → `HomePage`, `*` → `NotFoundPage`, `ErrorPage` as `errorElement`)
- `src/pages/home.tsx` — single-thread chat: `useInfiniteQuery` history paginated by `before=RFC3339` (cursor = earliest `created_at`), `useMutation` send `POST /chat {prompt}` with optimistic append to first page, `IntersectionObserver` on top sentinel, floating action buttons
- `src/hooks/home/useHomePage.ts` — chat state + mutations
- `src/components/home/dropzone/DocumentDropzone.tsx` — `react-dropzone` wrapper, PDF-only `accept: {"application/pdf": [".pdf"]}`, manual max 10 enforcement, `truncateMiddle(name,32)` preserves extension, preview via `URL.createObjectURL` + `window.open` new tab, revoke on remove/clear/unmount
- `src/components/home/modal/InsertDocumentModal.tsx` — holds `PdfPreviewFile[]` (`File & {preview,id}`), `useMutation(uploadDocumentsMutationOptions())`, snapshot pattern for toast/revoke on success
- `src/components/home/button/SyncDocumentsButton.tsx` — `useMutation(syncDocumentsMutationOptions())` → `POST /rag/seed`, `isPending` spinner/disabled, success toast, error via global cache only
- `src/components/ui/` — shadcn base-nova (`button`, `dialog` via `@base-ui/react`, `sonner`), `src/components/shared/modal/Modal.tsx` wraps dialog (now accepts `className`)
- `src/lib/query-client.ts` — single `queryClient`, global `QueryCache`/`MutationCache.onError` toasts via `sonner` (`getErrorMessage` in `src/lib/error.ts`); defaults `staleTime:60s`, `retry:1`, `refetchOnWindowFocus:false`

## API

- `src/api/client.ts` — `redaxios` `apiClient` (`VITE_API_URL` || `http://localhost:8080`), **no default `Content-Type`** — `redaxios` auto-sets `application/json` for plain objects; do **not** set `Content-Type` manually for `FormData` or Go's `ParseMultipartForm` fails with `no multipart boundary param`
- `src/api/chat/` — `getChatHistory` `GET /chat?before=`, `sendChat` `POST /chat {prompt}`; `src/api/documents/documents.post.api.ts` — `uploadDocuments(files: File[])` `POST /rag/document` field `files` repeated (`FormData`), `syncDocuments(): Promise<string>` `POST /rag/seed` returns `outer.message` via `outerSchema` (`src/schemas/envelope.ts:11`)
- `src/schemas/` — zod + inferred types (`chat.ts`, `document.ts`, `envelope.ts: outerSchema`/`createEnvelopeSchema`). Enveloped Go `pkg.Response` `{message,data,error}` unwrapped via `src/lib/envelope.ts:unwrapEnvelope` (throws on `error`)
- `src/api/documents/documents.post.query.ts` — `mutationOptions` factories `uploadDocumentsMutationOptions`/`syncDocumentsMutationOptions` (`retry:0`, key `["documents","upload"|"sync"]`); callers `useMutation(opts)` and rely on global `onError` — do not add local `onError` toast (double toast), use per-call `onSuccess` with snapshot for `files` if need stable closure
- Path alias and `FormData` boundary gotcha are the most common agent mistakes here

## Env

`.env` gitignored; copy `.env.example` (`VITE_API_URL` only). Vite vars must be `VITE_` prefixed.
