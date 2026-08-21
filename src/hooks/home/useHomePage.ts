import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { chatHistoryInfiniteQueryOptions, sendChat } from "@/api"
import { queryClient } from "@/lib/query-client"
import type { ChatMessage } from "@/schemas/chat"

export const useHomePage = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isHistoryPending,
    isError,
    error,
  } = useInfiniteQuery(chatHistoryInfiniteQueryOptions())

  const messages = useMemo(() => {
    if (!data) return []
    return [...data.pages].reverse().flat()
  }, [data])

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }

  const hasScrolledOnce = useRef(false)
  useEffect(() => {
    if (!hasScrolledOnce.current && messages.length > 0) {
      hasScrolledOnce.current = true
      scrollToBottom("instant")
    }
  }, [messages.length])

  // infinite scroll: load older when sentinel is visible
  useEffect(() => {
    const root = scrollRef.current
    const sentinel = topSentinelRef.current
    if (!root || !sentinel) return
    if (!hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          const prevHeight = root.scrollHeight
          const prevTop = root.scrollTop
          fetchNextPage().then(() => {
            // preserve scroll position after prepending
            requestAnimationFrame(() => {
              const newHeight = root.scrollHeight
              root.scrollTop = prevTop + (newHeight - prevHeight)
            })
          })
        }
      },
      { root, threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const sendMutation = useMutation({
    mutationFn: sendChat,
    onMutate: async (prompt) => {
      const trimmed = prompt.trim()
      if (!trimmed) return
      await queryClient.cancelQueries({ queryKey: ["chats", "history"] })
      const now = new Date().toISOString()
      const optimisticUser: ChatMessage = {
        role: "user",
        content: trimmed,
        created_at: now,
      }
      queryClient.setQueryData<InfiniteData<ChatMessage[]>>(
        ["chats", "history"],
        (old) => {
          if (!old)
            return {
              pages: [[optimisticUser]],
              pageParams: [undefined],
            } as InfiniteData<ChatMessage[]>
          const firstPage = old.pages[0]
          const rest = old.pages.slice(1)
          const nextFirst = firstPage
            ? [...firstPage, optimisticUser]
            : [optimisticUser]
          return { ...old, pages: [nextFirst, ...rest] }
        },
      )
    },
    onSuccess: (res) => {
      const now = new Date().toISOString()
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.reply,
        created_at: now,
        documents: res.documents ?? [],
      }
      queryClient.setQueryData<InfiniteData<ChatMessage[]>>(
        ["chats", "history"],
        (old) => {
          if (!old)
            return {
              pages: [[assistantMsg]],
              pageParams: [undefined],
            } as InfiniteData<ChatMessage[]>
          const firstPage = old.pages[0]
          const rest = old.pages.slice(1)
          const nextFirst = firstPage
            ? [...firstPage, assistantMsg]
            : [assistantMsg]
          return { ...old, pages: [nextFirst, ...rest] }
        },
      )
      requestAnimationFrame(() => scrollToBottom("smooth"))
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ["chats", "history"] })
    },
  })

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || sendMutation.isPending) return
    setInput("")
    sendMutation.mutate(trimmed)
    requestAnimationFrame(() => scrollToBottom("smooth"))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return {
    scrollRef,
    topSentinelRef,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isHistoryPending,
    isError,
    error,
    messages,
    sendMutation,
    input,
    setInput,
    handleKeyDown,
    handleSend,
  }
}
