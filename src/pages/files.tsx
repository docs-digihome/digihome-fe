import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  FileText,
  Files,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link, NavLink } from "react-router"
import { seededDocumentsQueryOptions } from "@/api/documents/documents.get.query"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const FilesPage = () => {
  const [search, setSearch] = useState("")
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(
    seededDocumentsQueryOptions(),
  )

  const docs = useMemo(() => {
    const raw = data ?? []
    // backend currently returns 6 empty placeholders (document_name="") — hide them
    return raw.filter((d) => d.document_name.trim() !== "")
  }, [data])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return docs
    return docs.filter((doc) => doc.document_name.toLowerCase().includes(q))
  }, [docs, search])

  const assetURL =
    import.meta.env.VITE_ASSETS_BASE_URL ??
    import.meta.env.VITE_ASSETS_BASED_URL ??
    "http://localhost:9000"

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="shrink-0 border-b bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-none">DigiHome</h1>
              <p className="text-xs text-muted-foreground">Seeded documents</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ArrowLeft className="size-4" />
              Back to chat
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <Files className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold leading-none">
                  Seeded files
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isPending
                    ? "Loading..."
                    : `${filtered.length} of ${docs.length} documents`}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isPending || isFetching}
            >
              {isFetching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Refresh
            </Button>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
            />
          </div>

          {isPending && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-sm">Loading documents...</span>
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load documents:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          )}

          {!isPending && !isError && docs.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
                <Files className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No documents seeded yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Upload PDFs and sync them to see the seeded list here.
              </p>
              <Link
                to="/"
                className={cn(buttonVariants({ size: "sm" }), "mt-4")}
              >
                Go to chat
              </Link>
            </div>
          )}

          {!isPending &&
            !isError &&
            docs.length > 0 &&
            filtered.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No documents match &quot;{search.trim()}&quot;
              </div>
            )}

          {!isPending && !isError && filtered.length > 0 && (
            <ul className="divide-y rounded-xl border bg-card">
              {filtered.map((doc) => (
                <li
                  key={`${doc.document_name}-${doc.link}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-4 text-muted-foreground" />
                  </span>
                  {doc.link ? (
                    <NavLink
                      to={`${assetURL}/${doc.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 flex-1 break-all font-medium hover:underline"
                    >
                      {doc.document_name}
                    </NavLink>
                  ) : (
                    <span className="min-w-0 flex-1 break-all font-medium">
                      {doc.document_name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilesPage
