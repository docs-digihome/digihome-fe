import { syncDocumentsMutationOptions } from "@/api"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { CloudSync, Loader2 } from "lucide-react"
import { toast } from "sonner"

export const SyncDocumentsButton = () => {
  const syncMutation = useMutation(syncDocumentsMutationOptions())
  const handleSync = () => {
    if (syncMutation.isPending) return
    syncMutation.mutate(undefined, {
      onSuccess: (msg) => toast.success(msg || "sync success"),
    })
  }
  return (
    <Button
      size="icon-lg"
      aria-label="Sync documents"
      aria-busy={syncMutation.isPending}
      onClick={handleSync}
      disabled={syncMutation.isPending}
      className="fixed top-10 right-6 z-50 size-14 rounded-full shadow-lg md:bottom-6 cursor-pointer"
    >
      {syncMutation.isPending ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <CloudSync className="size-5" />
      )}
    </Button>
  )
}
