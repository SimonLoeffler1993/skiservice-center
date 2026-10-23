"use client"

import { createContext, useCallback, useContext, useState } from "react";
import { SkiArtArray } from "@/types/materialtypes";
import { getSkiArt } from "@/lib/materialactions";

type SkiArtContextType = {
    artPromise: Promise<SkiArtArray>;
    refreshArtPromise: () => void;
}

const SkiArtContext = createContext<SkiArtContextType | null>(null);

export function SkiArtContextProvider({ children, artPromise }: { children: React.ReactNode, artPromise: Promise<SkiArtArray> }) {
    // State stellt Reload sicher
    const [statefulPromise, setStatefulPromise] = useState<Promise<SkiArtArray>>(artPromise);
    // Stabile Referenz, sonst lösen Effects mit dieser Abhängigkeit eine Endlosschleife aus
    const refreshArtPromise = useCallback(() => {
        setStatefulPromise(getSkiArt());
    }, []);
    
    return (
        <SkiArtContext.Provider value={{ artPromise: statefulPromise, refreshArtPromise }}>
            {children}
        </SkiArtContext.Provider>
    );
}

export const useSkiArtContext = () => {
    const context = useContext(SkiArtContext);
    if (!context) {
        throw new Error("useSkiArtContext muss in einem SkiArtContextProvider verwendet werden");
    }
    return context;
}
