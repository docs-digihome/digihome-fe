import axios from "redaxios"

const API_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_BASE_URL ??
  "http://localhost:8080"

export const apiClient = axios.create({
  baseURL: API_URL,
})
