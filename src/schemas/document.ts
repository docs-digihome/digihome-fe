import { z } from "zod"
import { ChatDocumentSchema } from "./chat"

export const DocumentsUploadResponseSchema = z.object({
  object_key: z.string().nullable().optional(),
  original_name: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
})

export type DocumentsUploadResponse = z.infer<
  typeof DocumentsUploadResponseSchema
>

export const SeededDocumentsSchema = z.array(ChatDocumentSchema)

export type SeededDocuments = z.infer<typeof SeededDocumentsSchema>

// legacy: some cached responses used { document: [...] } envelope data
export const SeededDocumentsObjectSchema = z.object({
  document: z.array(ChatDocumentSchema).nullable().optional(),
})
