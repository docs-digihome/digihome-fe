import { ChatMessageListSchema, type ChatMessage } from "@/schemas/chat"
import { apiClient } from "../client"
import { unwrapEnvelope } from "@/lib/envelope"

export const getChatHistory = async (
  before?: string,
): Promise<ChatMessage[]> => {
  const params = before ? { before } : undefined
  const { data } = await apiClient.get<unknown>(
    "/chat",
    params ? { params } : undefined,
  )
  return unwrapEnvelope(data, ChatMessageListSchema)
}
