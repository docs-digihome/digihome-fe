import axios from "redaxios"
import { API_BASE_URL } from "@/lib/env"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})
