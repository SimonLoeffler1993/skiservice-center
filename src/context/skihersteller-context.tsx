"use client"

import { createContext, useCallback, useContext, useState } from "react";
import { SkiHerstellerArray } from "@/types/materialtypes";
import { getSkiHersteller } from "@/lib/materialactions";

type SkiHerstllerContextType = {
    herstellerPromise: Promise<SkiHerstellerArray>;
    refreshHerstellerPromise: () => void;
}

const SkiHerstellerContext = createContext<SkiHerstllerContextType | null>(null);

export function SkiHerstellerContextProvider({ children, herstellerPromise }: { children: React.ReactNode, herstellerPromise: Promise<SkiHerstellerArray> }) {
    // State stellt Reload sicher
    const [statefulPromise, setStatefulPromise] = useState<Promise<SkiHerstellerArray>>(herstellerPromise);
    // Stabile Referenz, sonst lösen Effects mit dieser Abhängigkeit eine Endlosschleife aus
    const refreshHerstellerPromise = useCallback(() => {
        setStatefulPromise(getSkiHersteller());
    }, []);
    
    return (
        <SkiHerstellerContext.Provider value={{ herstellerPromise: statefulPromise, refreshHerstellerPromise }}>
            {children}
        </SkiHerstellerContext.Provider>
    );
}

export const useSkiHerstellerContext = () => {
    const context = useContext(SkiHerstellerContext);
    if (!context) {
        throw new Error("useSkiHerstellerContext muss in einem SkiHerstellerContextProvider verwendet werden");
    }
    return context;
}
