import { mutationOptions } from "@tanstack/react-query"
import { syncDocuments, uploadDocuments } from "./documents.post.api"

export const uploadDocumentsMutationOptions = () =>
  mutationOptions({
    mutationKey: ["documents", "upload"],
    mutationFn: (files: File[]) => uploadDocuments(files),
    retry: 0,
  })

export const syncDocumentsMutationOptions = () =>
  mutationOptions({
    mutationKey: ["documents", "sync"],
    mutationFn: () => syncDocuments(),
    retry: 0,
  })
