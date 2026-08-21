import { infiniteQueryOptions } from "@tanstack/react-query"
import { getChatHistory } from "./chat.get.api"

const CHAT_LIMIT = 20

export const chatHistoryInfiniteQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: ["chats", "history"],
    queryFn: ({ pageParam }) => getChatHistory(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < CHAT_LIMIT) return undefined
      const oldest = lastPage[0]
      return oldest?.created_at
    },
  })
}
