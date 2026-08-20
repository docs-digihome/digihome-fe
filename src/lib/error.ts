import { ZodError } from "zod"

export function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message)
    return messages.length > 0 ? messages.join(", ") : "Invalid data"
  }
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "Something went wrong"
}
