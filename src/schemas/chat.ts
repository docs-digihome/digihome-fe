import { z } from "zod"

export const ChatRoleSchema = z.enum(["user", "assistant"])
export type ChatRole = z.infer<typeof ChatRoleSchema>

export const ChatDocumentSchema = z.object({
  document_name: z.string(),
  link: z.string(),
})

export type ChatDocument = z.infer<typeof ChatDocumentSchema>

export const ChatMessageSchema = z.object({
  role: ChatRoleSchema,
  content: z.string(),
  created_at: z.string(),
  documents: z.array(ChatDocumentSchema).nullable().optional(),
})

export const ChatMessageListSchema = z.array(ChatMessageSchema)

export type ChatMessage = z.infer<typeof ChatMessageSchema>

export const ChatResponseSchema = z.object({
  reply: z.string(),
  documents: z.array(ChatDocumentSchema).optional(),
})

export type ChatResponse = z.infer<typeof ChatResponseSchema>
