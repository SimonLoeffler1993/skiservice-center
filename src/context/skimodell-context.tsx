"use client"

import { ModellArray } from "@/types/materialtypes";
import { createContext, useContext, useState } from "react";
import { getModell } from "@/lib/materialactions";

type SkiModellContextType = {
    modellPromise: Promise<ModellArray>;
    refreshModellPromise: () => void;
}

export const SkiModellContext = createContext<SkiModellContextType | null>(null);

export function SkiModellContextProvider({ children, modellPromise }: { children: React.ReactNode, modellPromise: Promise<ModellArray> }) {
    // State stellt Reload sicher
    const [statefulPromise, setStatefulPromise] = useState<Promise<ModellArray>>(modellPromise);
    function refreshModellPromise() {
        setStatefulPromise(getModell());
    }
    
    return (
        <SkiModellContext.Provider value={{ modellPromise: statefulPromise, refreshModellPromise }}>
            {children}
        </SkiModellContext.Provider>
    );
}

export const useSkiModellContext = () => {
    const context = useContext(SkiModellContext);
    if (!context) {
        throw new Error("useSkiModellContext muss in einem SkiModellContextProvider verwendet werden");
    }
    return context;
}
