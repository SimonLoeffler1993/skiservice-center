"use client"
import { createContext, useContext } from "react";
import { SkistockArray } from "@/types/materialtypes";

type SkimaterialContextType = {
    skistoeckePromise: Promise<SkistockArray>;
}

const SkimaterialContext = createContext<SkimaterialContextType | null>(null);

export function SkimaterialContextProvider({ children, skistoeckePromise }: { children: React.ReactNode, skistoeckePromise: Promise<SkistockArray> }) {
    return (
        <SkimaterialContext.Provider value={{ skistoeckePromise }}>
            {children}
        </SkimaterialContext.Provider>
    );
}

export const useSkimaterialContext = () => {
    const context = useContext(SkimaterialContext);
    if (!context) {
        throw new Error("useSkimaterialContext muss in einem SkimaterialContextProvider verwendet werden");
    }
    return context;
}
