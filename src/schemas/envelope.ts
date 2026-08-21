import { z } from "zod"

export function createEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    message: z.string().optional(),
    data: dataSchema,
    error: z.string().optional(),
  })
}

export const outerSchema = z.object({
  message: z.string().optional(),
  data: z.unknown().nullable().optional(),
  error: z.string().optional(),
})

export type Envelope<T> = {
  message?: string
  data: T
  error?: string
}
