import { z } from "zod"

export const DocumentsUploadResponseSchema = z.object({
  object_key: z.string().nullable().optional(),
  original_name: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
})

export type DocumentsUploadResponse = z.infer<
  typeof DocumentsUploadResponseSchema
>

export const SeededDocumentsSchema = z.object({
  document_name: z.array(z.string().min(1)),
})

export type SeededDocuments = z.infer<typeof SeededDocumentsSchema>
