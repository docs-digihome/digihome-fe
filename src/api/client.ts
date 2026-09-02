import axios from "redaxios"
import { getApiBaseUrl } from "@/lib/env"

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
})

// redaxios has no interceptors — patch methods to re-read runtime config on each call
// handles case where window.__RUNTIME_CONFIG__ is set after module evaluation
for (const method of [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "request",
] as const) {
  const orig = (
    apiClient[method] as unknown as (...args: unknown[]) => unknown
  ).bind(apiClient)
  ;(apiClient[method] as unknown as (...args: unknown[]) => unknown) = (
    ...args: unknown[]
  ) => {
    apiClient.defaults.baseURL = getApiBaseUrl()
    return orig(...(args as never[]))
  }
}
