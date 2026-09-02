type RuntimeConfig = {
  BASE_URL?: string
  API_BASE_URL?: string
  ASSETS_BASE_URL?: string
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

const getRuntimeConfig = (): RuntimeConfig | undefined => {
  if (typeof window !== "undefined") return window.__RUNTIME_CONFIG__
  return undefined
}

const pick = (v: string | undefined): string | undefined => {
  if (v !== undefined && v.trim() !== "") return v
  return undefined
}

export const getApiBaseUrl = (): string =>
  pick(getRuntimeConfig()?.API_BASE_URL) ??
  pick(getRuntimeConfig()?.BASE_URL) ??
  pick(import.meta.env.VITE_API_BASE_URL) ??
  pick(import.meta.env.VITE_BASE_URL) ??
  "http://localhost:8080"

export const getAssetsBaseUrl = (): string =>
  pick(getRuntimeConfig()?.ASSETS_BASE_URL) ??
  pick(import.meta.env.VITE_ASSETS_BASE_URL) ??
  pick(import.meta.env.VITE_ASSETS_BASED_URL) ??
  "http://localhost:9000"

// kept for backwards compat — evaluated lazily at import but prefer getters above for runtime correctness
export const API_BASE_URL: string = getApiBaseUrl()
export const ASSETS_BASE_URL: string = getAssetsBaseUrl()

export const getAssetUrl = (link: string): string => {
  const base = getAssetsBaseUrl().replace(/\/+$/, "")
  const path = link.replace(/^\/+/, "")
  return path ? `${base}/${path}` : base
}
