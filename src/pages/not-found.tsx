import { Link } from "react-router"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Link to="/" className="text-primary underline-offset-4 hover:underline">
        Go back home
      </Link>
    </div>
  )
}
