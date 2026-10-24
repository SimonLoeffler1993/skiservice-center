// app/providers.tsx
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { useState } from "react"

import { BackendUrlProvider } from "@/context/backend-context"

export function Providers({ children, backendUrl }: { children: React.ReactNode; backendUrl: string }) {
    // Daten 1min im Cache behalten, damit nicht bei jedem Seitenwechsel neu geladen werden muss
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: { staleTime: 60 * 1000, retry: 2 }
        }
    }))
    // const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <BackendUrlProvider backendUrl={backendUrl}>
                {children}
            </BackendUrlProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}