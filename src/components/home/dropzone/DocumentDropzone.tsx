import { FileText, Trash2, UploadCloud, Eye, X } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PdfPreviewFile = File & {
  preview: string
  id: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}

function createPreviewFile(file: File): PdfPreviewFile {
  const preview = URL.createObjectURL(file)
  const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`
  return Object.assign(file, { preview, id }) as PdfPreviewFile
}

const MAX_TOTAL_BYTES = 64 * 1024 * 1024

function truncateMiddle(name: string, maxLen = 32): string {
  if (name.length <= maxLen) return name
  const dot = name.lastIndexOf(".")
  const ext = dot > 0 ? name.slice(dot) : ""
  const base = dot > 0 ? name.slice(0, dot) : name
  const budget = maxLen - ext.length - 3
  if (budget <= 6) return base.slice(0, maxLen - ext.length - 3) + "..." + ext
  const head = Math.ceil(budget * 0.65)
  const tail = budget - head
  return base.slice(0, head) + "..." + base.slice(-tail) + ext
}

interface DocumentDropzoneProps {
  files: PdfPreviewFile[]
  onFilesChange: (files: PdfPreviewFile[]) => void
  maxFiles?: number
  disabled?: boolean
}

export function DocumentDropzone({
  files,
  onFilesChange,
  maxFiles = 10,
  disabled = false,
}: DocumentDropzoneProps) {
  const totalBytes = files.reduce((acc, f) => acc + f.size, 0)
  const isFull = files.length >= maxFiles
  const isSizeFull = totalBytes >= MAX_TOTAL_BYTES

  const openPreview = useCallback((file: PdfPreviewFile) => {
    window.open(file.preview, "_blank", "noopener,noreferrer")
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        for (const rejection of fileRejections) {
          const name = rejection.file.name
          for (const err of rejection.errors) {
            if (err.code === "file-invalid-type") {
              toast.error(`${name}: only PDF files are allowed`)
            } else if (err.code === "too-many-files") {
              toast.error(`Max ${maxFiles} PDF files allowed`)
            } else {
              toast.error(`${name}: ${err.message}`)
            }
          }
        }
      }

      if (acceptedFiles.length === 0) return

      const remaining = maxFiles - files.length
      if (remaining <= 0) {
        toast.error(`You can only upload up to ${maxFiles} PDFs`)
        return
      }

      if (totalBytes >= MAX_TOTAL_BYTES) {
        toast.error(
          `Total size limit reached (${formatBytes(MAX_TOTAL_BYTES)}). Remove a file before adding more.`,
        )
        return
      }

      const cappedByCount = acceptedFiles.slice(0, remaining)
      if (acceptedFiles.length > remaining) {
        toast.error(
          `Only ${remaining} more file(s) allowed — ${acceptedFiles.length - remaining} file(s) ignored (max ${maxFiles})`,
        )
      }

      const toAdd: File[] = []
      const rejectedBySize: File[] = []
      let runningTotal = totalBytes
      for (const file of cappedByCount) {
        if (runningTotal + file.size > MAX_TOTAL_BYTES) {
          rejectedBySize.push(file)
          continue
        }
        toAdd.push(file)
        runningTotal += file.size
      }

      if (rejectedBySize.length > 0) {
        if (toAdd.length === 0) {
          const first = rejectedBySize[0]
          toast.error(
            `${first.name} (${formatBytes(first.size)}) would exceed total limit of ${formatBytes(MAX_TOTAL_BYTES)} — current total ${formatBytes(totalBytes)}`,
          )
          if (rejectedBySize.length > 1) {
            toast.error(
              `${rejectedBySize.length - 1} more file(s) also exceed the ${formatBytes(MAX_TOTAL_BYTES)} total limit and were skipped`,
            )
          }
        } else {
          toast.error(
            `${rejectedBySize.length} file(s) skipped — total size would exceed ${formatBytes(MAX_TOTAL_BYTES)} (${formatBytes(totalBytes)} already selected)`,
          )
        }
      }

      if (toAdd.length === 0) return

      const mapped = toAdd.map(createPreviewFile)
      onFilesChange([...files, ...mapped])
    },
    [files, maxFiles, onFilesChange, totalBytes],
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    disabled: disabled || isFull || isSizeFull,
    noClick: false,
    noKeyboard: false,
  })

  const handleRemove = useCallback(
    (id: string) => {
      const target = files.find((f) => f.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      onFilesChange(files.filter((f) => f.id !== id))
    },
    [files, onFilesChange],
  )

  const handleClearAll = useCallback(() => {
    for (const f of files) URL.revokeObjectURL(f.preview)
    onFilesChange([])
  }, [files, onFilesChange])

  // revoke on unmount — best-effort (per-file revoke already on remove/clear)
  useEffect(() => {
    return () => {
      for (const f of files) URL.revokeObjectURL(f.preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors outline-none cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-ring/20",
          disabled && "opacity-50 cursor-not-allowed",
          isDragAccept && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/10",
          !isDragActive &&
            !isDragAccept &&
            !isDragReject &&
            "border-border bg-muted/20 hover:bg-muted/40",
          isDragActive &&
            !isDragAccept &&
            !isDragReject &&
            "border-primary/50 bg-primary/5",
          (isFull || isSizeFull) && "opacity-60 pointer-events-none",
        )}
        aria-disabled={disabled || isFull || isSizeFull}
      >
        <input {...getInputProps()} aria-label="Upload PDFs" />
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <UploadCloud className="size-5 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium">
          {isDragActive
            ? isDragReject
              ? "Only PDF files allowed"
              : "Drop PDFs here"
            : "Drag & drop PDFs here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or{" "}
          <button
            type="button"
            onClick={open}
            className="font-medium text-primary underline-offset-4 hover:underline"
            disabled={disabled || isFull || isSizeFull}
          >
            click to browse
          </button>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          PDF only · max {maxFiles} files · {files.length}/{maxFiles} selected
          {" · "}
          {formatBytes(totalBytes)} / {formatBytes(MAX_TOTAL_BYTES)}
        </p>
        {isSizeFull && (
          <p className="mt-1 text-xs font-medium text-destructive">
            Total size limit reached — remove a file to add more
          </p>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              {files.length} file{files.length > 1 ? "s" : ""} selected ·{" "}
              {formatBytes(totalBytes)} / {formatBytes(MAX_TOTAL_BYTES)}
            </p>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClearAll}
              disabled={disabled}
              className="h-7 text-xs"
            >
              <Trash2 className="size-3" /> Clear all
            </Button>
          </div>

          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            {files.map((f) => (
              <div
                key={f.id}
                className="group flex items-center gap-3 rounded-lg border bg-card p-2.5 text-sm"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </div>
                <button
                  type="button"
                  onClick={() => openPreview(f)}
                  className="min-w-0 flex-1 text-left"
                  title={`${f.name} — click to preview`}
                  aria-label={`Preview ${f.name}`}
                >
                  <p className="font-medium leading-none">
                    {truncateMiddle(f.name)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatBytes(f.size)}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => openPreview(f)}
                    aria-label={`Preview ${f.name}`}
                    title="Open preview in new tab"
                  >
                    <Eye className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemove(f.id)}
                    aria-label={`Remove ${f.name}`}
                    disabled={disabled}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
