import { postsQuery } from "@/api/posts"
import { queryClient } from "@/lib/query-client"

export async function homeLoader() {
  return queryClient.ensureQueryData(postsQuery())
}
