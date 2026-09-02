import { FileText, Loader2 } from "lucide-react"
import { NavLink } from "react-router"
import { ASSETS_BASE_URL } from "@/lib/env"
import { formatISOTime } from "@/lib/time"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/schemas/chat"

export const ChatBubble = ({
  message,
  pending,
}: {
  message?: ChatMessage
  pending?: boolean
}) => {
  if (pending) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[78%] rounded-2xl rounded-bl-sm border bg-muted px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Thinking...
          </div>
        </div>
      </div>
    )
  }

  if (!message) return null
  const isUser = message.role === "user"
  const assetURL = ASSETS_BASE_URL

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm border bg-card",
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
        {message.role === "assistant" && message.documents?.length ? (
          <div className="mt-3 border-t border-border/50 pt-2">
            <p className="text-xs font-medium text-muted-foreground">Sources</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {message.documents.filter(Boolean).map((doc) => (
                <NavLink
                  key={`${doc.document_name}-${doc.link}`}
                  to={`${assetURL}/${doc.link}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs hover:bg-muted/80 hover:text-foreground"
                >
                  <FileText className="size-3" />
                  {doc.document_name}
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
        <span
          className={cn(
            "mt-1 block text-[11px]",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatISOTime(message.created_at)}
        </span>
      </div>
    </div>
  )
}

// base url/assets/document_name
