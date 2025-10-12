"use client";
import { createContext, useContext } from "react";
import { SaisonsNamenListe } from "@/types/saison";

export type SaisonContextType = {
    saisonPromise: Promise<SaisonsNamenListe>;
}

export const SaisonContext = createContext<SaisonContextType | null>(null);

export type SaisonContextProviderType = {
    children: React.ReactNode;
    saisonPromise: Promise<SaisonsNamenListe>;
}

export const SaisonContextProvider = ({ children, saisonPromise }: SaisonContextProviderType) => {
    return (
        <SaisonContext.Provider value={{ saisonPromise }}>
            {children}
        </SaisonContext.Provider>
    );
}

export const useSaisonContext = () => {
    const context = useContext(SaisonContext);
    if (!context) {
        throw new Error("useSaisonContext muss in einem SaisonContextProvider verwendet werden");
    }
    return context;
};
