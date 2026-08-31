import { apiClient } from "@/api/client"
import { unwrapEnvelope } from "@/lib/envelope"
import { SeededDocumentsSchema, type SeededDocuments } from "@/schemas/document"

export const getSeededDocuments = async (): Promise<SeededDocuments> => {
  const { data } = await apiClient.get<unknown>("/rag/documents")
  return unwrapEnvelope(data, SeededDocumentsSchema)
}
