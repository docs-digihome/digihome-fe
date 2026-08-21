import { ChatResponseSchema, type ChatResponse } from "@/schemas/chat"
import { apiClient } from "../client"
import { unwrapEnvelope } from "@/lib/envelope"

export const sendChat = async (prompt: string): Promise<ChatResponse> => {
  const { data } = await apiClient.post<unknown>("/chat", { prompt })
  return unwrapEnvelope(data, ChatResponseSchema)
}
