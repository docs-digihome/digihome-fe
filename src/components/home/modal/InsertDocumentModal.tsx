import { DialogFooter } from "@/components/ui/dialog"
import { Modal } from "@/components/shared/modal/Modal"
import { Button } from "@/components/ui/button"
import { FilePlusCorner, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  DocumentDropzone,
  type PdfPreviewFile,
} from "@/components/home/dropzone/DocumentDropzone"
import { uploadDocumentsMutationOptions } from "@/api/documents"

export const InsertDocumentModal = ({ onClick }: { onClick?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<PdfPreviewFile[]>([])

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setFiles((prev) => {
        for (const f of prev) URL.revokeObjectURL(f.preview)
        return []
      })
    }
  }, [])

  const filesRef = useRef<PdfPreviewFile[]>(files)
  useEffect(() => {
    filesRef.current = files
  }, [files])

  useEffect(() => {
    return () => {
      for (const f of filesRef.current) URL.revokeObjectURL(f.preview)
    }
  }, [])

  const uploadMutation = useMutation(uploadDocumentsMutationOptions())

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error("Please select at least one PDF")
      return
    }
    const snapshot = [...files]
    uploadMutation.mutate(snapshot as unknown as File[], {
      onSuccess: () => {
        toast.success(`${snapshot.length} PDF(s) uploaded`)
        for (const f of snapshot) URL.revokeObjectURL(f.preview)
        setFiles([])
        setIsOpen(false)
      },
    })
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={handleOpenChange}>
      <Modal.Trigger>
        <Button
          size="icon-lg"
          aria-label="Open actions"
          onClick={onClick}
          className="fixed bottom-24 right-6 z-50 size-14 rounded-full shadow-lg md:bottom-6 cursor-pointer"
        >
          <FilePlusCorner className="size-5" />
        </Button>
      </Modal.Trigger>
      <Modal.Content
        title="Insert bulk documents"
        description="Drop up to 10 PDFs so AI knows what's actually happened"
        className="sm:max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <DocumentDropzone
          files={files}
          onFilesChange={setFiles}
          maxFiles={10}
          disabled={uploadMutation.isPending}
        />
        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>Upload {files.length ? `(${files.length})` : ""}</>
            )}
          </Button>
        </DialogFooter>
      </Modal.Content>
    </Modal>
  )
}
