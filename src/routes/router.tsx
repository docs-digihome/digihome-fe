import { createBrowserRouter } from "react-router"
import { homeLoader } from "@/routes/loaders"
import ErrorPage from "@/pages/error"
import HomePage from "@/pages/home"
import NotFoundPage from "@/pages/not-found"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    loader: homeLoader,
    errorElement: <ErrorPage />,
  },
  { path: "*", element: <NotFoundPage /> },
])
