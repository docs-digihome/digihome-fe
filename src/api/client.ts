import axios from "redaxios"

const API_URL =
  import.meta.env.VITE_API_URL ?? "https://jsonplaceholder.typicode.com"

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})
