import { z } from "zod"
import { createEnvelopeSchema } from "@/schemas/envelope"

export function unwrapEnvelope<T>(raw: unknown, dataSchema: z.ZodType<T>): T {
  const envelopeSchema = createEnvelopeSchema(dataSchema)
  const parsed = envelopeSchema.safeParse(raw)

  if (parsed.success) {
    if (parsed.data.error) throw new Error(parsed.data.error)
    return parsed.data.data
  }

  if (
    typeof raw === "object" &&
    raw !== null &&
    "error" in raw &&
    typeof (raw as { error: unknown }).error === "string" &&
    (raw as { error: string }).error
  ) {
    throw new Error((raw as { error: string }).error)
  }

  // Go ReturnError: { message: "error" } without data
  if (
    typeof raw === "object" &&
    raw !== null &&
    "message" in raw &&
    !("data" in raw)
  ) {
    const msg = (raw as { message: unknown }).message
    if (typeof msg === "string" && msg) throw new Error(msg)
  }

  const bare = dataSchema.safeParse(raw)
  if (bare.success) return bare.data

  if (typeof raw === "object" && raw !== null && "data" in raw) {
    const dataField = (raw as unknown as { data: unknown }).data
    if (dataField !== undefined) {
      const inner = dataSchema.safeParse(dataField)
      if (inner.success) return inner.data
    }
  }

  throw new Error("Invalid envelope payload")
}
