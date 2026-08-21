import { Loader2, Send, Sparkles } from "lucide-react"
import { ChatBubble } from "@/components/home/ChatBubble"
import { InsertDocumentModal } from "@/components/home/modal/InsertDocumentModal"
import { Button } from "@/components/ui/button"
import { useHomePage } from "@/hooks/home/useHomePage"
import { SyncDocumentsButton } from "@/components/home/button/SyncDocumentsButton"

export const HomePage = () => {
  const {
    error,
    fetchNextPage,
    handleKeyDown,
    handleSend,
    hasNextPage,
    input,
    isError,
    isFetchingNextPage,
    isHistoryPending,
    messages,
    scrollRef,
    sendMutation,
    setInput,
    topSentinelRef,
  } = useHomePage()
  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="shrink-0 border-b bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">DigiHome</h1>
            <p className="text-xs text-muted-foreground">
              Smart-home assistant
            </p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
          <div ref={topSentinelRef} className="h-1" />

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Loading older
                  </>
                ) : (
                  "Load older messages"
                )}
              </Button>
            </div>
          )}

          {isHistoryPending && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-sm">Loading conversation...</span>
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load chats:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          )}

          {!isHistoryPending && !isError && messages.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
                <Sparkles className="size-6 text-muted-foreground" />
              </div>
              <h2 className="mt-4 font-semibold">How can I help you today?</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Ask about your smart home, devices, or anything else. Your
                conversation history will appear here.
              </p>
            </div>
          )}

          {messages.map((m, idx) => (
            <ChatBubble key={`${m.created_at}-${idx}`} message={m} />
          ))}

          {sendMutation.isPending && <ChatBubble pending />}
        </div>
      </div>

      <div className="shrink-0 border-t bg-background">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/20">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask DigiHome anything..."
              rows={1}
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              disabled={sendMutation.isPending}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || sendMutation.isPending}
              aria-label="Send message"
              className="shrink-0 rounded-xl cursor-pointer"
            >
              {sendMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <InsertDocumentModal onClick={() => {}} />
      <SyncDocumentsButton />
    </div>
  )
}

export default HomePage
