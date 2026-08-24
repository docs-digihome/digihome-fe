import { type ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider, useTheme } from "@/components/theme/theme-provider"
import { queryClient } from "@/lib/query-client"

function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return <Toaster richColors position="top-right" theme={resolvedTheme} />
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ThemedToaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
