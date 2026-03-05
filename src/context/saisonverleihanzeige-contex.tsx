"use client";

import { createContext, useContext, useState } from "react";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import { getSaisonVerleihById } from "@/lib/saisonverleihactions";

type SaisonverleihanzeigeContextType = {
    saisonverleihanzeigePromise: Promise<SaisonverleihRead | null>;
    id: number;
    refreshSaisonverleihanzeigePromise: () => void;
}

type SaisonverleihanzeigeContextProviderType = {
    children: React.ReactNode;
    saisonverleihanzeigePromise: Promise<SaisonverleihRead | null>;
    id: number;
}

const SaisonverleihanzeigeContext = createContext<SaisonverleihanzeigeContextType | null>(null);

export function SaisonverleihanzeigeContextProvider({ children, saisonverleihanzeigePromise, id }: SaisonverleihanzeigeContextProviderType) {
    // State stellt Reload sicher
    const [statefulPromise, setStatefulPromise] = useState<Promise<SaisonverleihRead | null>>(saisonverleihanzeigePromise);
    function refreshSaisonverleihanzeigePromise() {
        setStatefulPromise(getSaisonVerleihById(id));
    }

    return (
        <SaisonverleihanzeigeContext.Provider value={{saisonverleihanzeigePromise: statefulPromise, id, refreshSaisonverleihanzeigePromise: refreshSaisonverleihanzeigePromise}}>
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
