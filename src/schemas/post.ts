import { z } from "zod"

export const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
})

export const PostListSchema = z.array(PostSchema)

export type Post = z.infer<typeof PostSchema>
