"use client";

import { createContext, useContext, useState } from "react";
import { SaisonverleihReadList } from "@/types/saisonverleihtypes";
import { getSaisonVerleihList } from "@/lib/saisonverleihactions";

type SaisonverleihlisteContextType = {
    saisonverleihlistePromise: Promise<SaisonverleihReadList | null>;
    refreshSaisonverleihlistePromise: (saisonID: number) => void;
}

type SaisonverleihlisteContextProviderType = {
    children: React.ReactNode;
    saisonverleihlistePromise: Promise<SaisonverleihReadList | null>;
}

const SaisonverleihlisteContext = createContext<SaisonverleihlisteContextType | null>(null);

export function SaisonverleihlisteContextProvider({ children, saisonverleihlistePromise }: SaisonverleihlisteContextProviderType) {
    const [statefulPromise, setStatefulPromise] = useState<Promise<SaisonverleihReadList | null>>(saisonverleihlistePromise);

    function refreshSaisonverleihlistePromise(saisonID: number) {
        setStatefulPromise(getSaisonVerleihList(saisonID));
    }

    return (
        <SaisonverleihlisteContext.Provider value={{ saisonverleihlistePromise: statefulPromise, refreshSaisonverleihlistePromise }}>
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
