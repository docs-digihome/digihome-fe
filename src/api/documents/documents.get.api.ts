import { apiClient } from "@/api/client"
import { unwrapEnvelope } from "@/lib/envelope"
import {
  SeededDocumentsObjectSchema,
  SeededDocumentsSchema,
  type SeededDocuments,
} from "@/schemas/document"

export const getSeededDocuments = async (): Promise<SeededDocuments> => {
  const { data } = await apiClient.get<unknown>("/rag/documents")
  try {
    return unwrapEnvelope(data, SeededDocumentsSchema)
  } catch {
    // fallback for legacy shape { document: [...] } wrapped in envelope
    const obj = unwrapEnvelope(data, SeededDocumentsObjectSchema)
    return obj.document ?? []
  }
}
