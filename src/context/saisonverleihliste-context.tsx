"use client";

import { createContext, useContext } from "react";
import { SaisonverleihReadList } from "@/types/saisonverleihtypes";

type SaisonverleihlisteContextType = {
    saisonverleihlistePromise: Promise<SaisonverleihReadList | null>;
}

type SaisonverleihlisteContextProviderType = {
    children: React.ReactNode;
    saisonverleihlistePromise: Promise<SaisonverleihReadList | null>;
}

const SaisonverleihlisteContext = createContext<SaisonverleihlisteContextType | null>(null);

export function SaisonverleihlisteContextProvider({ children, saisonverleihlistePromise }: SaisonverleihlisteContextProviderType) {
    return (
        <SaisonverleihlisteContext.Provider value={{saisonverleihlistePromise}}>
            {children}
        </SaisonverleihlisteContext.Provider>
    );
}

export const useSaisonverleihlisteContext = () => {
    const context = useContext(SaisonverleihlisteContext);
    if (!context) {
        throw new Error("useSaisonverleihlisteContext muss in einem SaisonverleihlisteContextProvider verwendet werden");
    }
    return context;
};
