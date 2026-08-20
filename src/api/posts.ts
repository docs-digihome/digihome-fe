import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import { PostListSchema, type Post } from "@/schemas/post"

export async function getPosts() {
  const { data } = await apiClient.get<Post[]>("/posts")
  const parsed = PostListSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid posts payload")
  return parsed.data
}

export const postsQuery = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: getPosts,
  })
