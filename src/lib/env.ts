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

const runtime = getRuntimeConfig()

const pick = (v: string | undefined): string | undefined => {
  if (v !== undefined && v.trim() !== "") return v
  return undefined
}

export const API_BASE_URL: string =
  pick(runtime?.API_BASE_URL) ??
  pick(runtime?.BASE_URL) ??
  pick(import.meta.env.VITE_API_BASE_URL) ??
  pick(import.meta.env.VITE_BASE_URL) ??
  "http://localhost:8080"

export const ASSETS_BASE_URL: string =
  pick(runtime?.ASSETS_BASE_URL) ??
  pick(import.meta.env.VITE_ASSETS_BASE_URL) ??
  pick(import.meta.env.VITE_ASSETS_BASED_URL) ??
  "http://localhost:9000"

export const getAssetUrl = (link: string): string => {
  const base = ASSETS_BASE_URL.replace(/\/+$/, "")
  const path = link.replace(/^\/+/, "")
  return path ? `${base}/${path}` : base
}
