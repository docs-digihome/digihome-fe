import { createBrowserRouter } from "react-router"
import ErrorPage from "@/pages/error"
import HomePage from "@/pages/home"
import NotFoundPage from "@/pages/not-found"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  { path: "*", element: <NotFoundPage /> },
])
