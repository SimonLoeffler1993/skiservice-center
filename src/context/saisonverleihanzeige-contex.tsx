"use client";

import { createContext, useContext } from "react";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";

type SaisonverleihanzeigeContextType = {
    saisonverleihanzeigePromise: Promise<SaisonverleihRead | null>;
}

type SaisonverleihanzeigeContextProviderType = {
    children: React.ReactNode;
    saisonverleihanzeigePromise: Promise<SaisonverleihRead | null>;
}

const SaisonverleihanzeigeContext = createContext<SaisonverleihanzeigeContextType | null>(null);

export function SaisonverleihanzeigeContextProvider({ children, saisonverleihanzeigePromise }: SaisonverleihanzeigeContextProviderType) {

    return (
        <SaisonverleihanzeigeContext.Provider value={{saisonverleihanzeigePromise}}>
            {children}
        </SaisonverleihanzeigeContext.Provider>
    );
}

export const useSaisonverleihanzeigeContext = () => {
    const context = useContext(SaisonverleihanzeigeContext);
    if (!context) {
        throw new Error("useSaisonverleihanzeigeContext muss in einem SaisonverleihanzeigeContextProvider verwendet werden");
    }
    return context;
};
