"use client";

import { createContext, useContext } from "react";

// Adresse der API für den Browser (z.B. PDF-Links), kommt zur Laufzeit aus BACKEND_URL
const BackendUrlContext = createContext<string>("http://localhost:8000");

export function BackendUrlProvider({ backendUrl, children }: { backendUrl: string; children: React.ReactNode }) {
    return <BackendUrlContext.Provider value={backendUrl.replace(/\/+$/, "")}>{children}</BackendUrlContext.Provider>;
}

export function useBackendUrl() {
    return useContext(BackendUrlContext);
}
