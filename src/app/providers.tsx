// app/providers.tsx
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
    // Daten 1min im Cache behalten, damit nicht bei jedem Seitenwechsel neu geladen werden muss
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: { staleTime: 60 * 1000 }
        }
    }))
    // const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    )
}