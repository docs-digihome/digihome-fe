import { useLoaderData } from "react-router"
import type { Post } from "@/schemas/post"

export default function HomePage() {
  const posts = useLoaderData<Post[]>()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">DigiHome</h1>
      <p className="mt-2 text-muted-foreground">
        Posts loaded with React Router data mode + TanStack Query, validated by
        Zod.
      </p>

      <ul className="mt-8 space-y-3">
        {posts.slice(0, 5).map((post) => (
          <li key={post.id} className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
