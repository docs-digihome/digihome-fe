import { apiClient } from "@/api/client"
import { unwrapEnvelope } from "@/lib/envelope"
import {
  DocumentsUploadResponseSchema,
  type DocumentsUploadResponse,
} from "@/schemas/document"
import { outerSchema } from "@/schemas/envelope"

/**
 * Upload up to 10 PDF files.
 * Change the path later as needed — currently POST /documents/bulk
 * Expects multipart/form-data with field `files` (repeated).
 */
export const uploadDocuments = async (
  files: File[],
): Promise<DocumentsUploadResponse> => {
  const form = new FormData()
  for (const f of files) form.append("files", f)

  // do not set Content-Type — browser/fetch will set
  // "multipart/form-data; boundary=..." automatically for FormData.
  // Setting it manually drops the boundary and breaks Go's ParseMultipartForm.
  const { data } = await apiClient.post<unknown>("/rag/document", form)
  return unwrapEnvelope(data, DocumentsUploadResponseSchema)
}

export const syncDocuments = async (): Promise<string> => {
  const { data } = await apiClient.post<unknown>("/rag/seed")
  const outer = outerSchema.parse(data)
  if (outer.error) throw new Error(outer.error)
  return outer.message ?? "seed success"
}
