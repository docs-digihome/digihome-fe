import { createBrowserRouter } from "react-router"
import ErrorPage from "@/pages/error"
import FilesPage from "@/pages/files"
import HomePage from "@/pages/home"
import NotFoundPage from "@/pages/not-found"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/files",
    element: <FilesPage />,
    errorElement: <ErrorPage />,
  },
  { path: "*", element: <NotFoundPage /> },
])
