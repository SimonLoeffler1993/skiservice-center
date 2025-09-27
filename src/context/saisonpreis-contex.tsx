"use client";
import { createContext, useContext } from "react";
import { SaisonverleihPreise } from "@/types/saisonverleihtypes";


type SaisonpreisContextType ={
    saisonpreisePromise: Promise<SaisonverleihPreise>;
}
const SaisonpreisContext = createContext<SaisonpreisContextType | null>(null);

type SaisonpreisContextProviderType = {
    children: React.ReactNode;
    saisonpreisePromise: Promise<SaisonverleihPreise>;
}

export function SaisonpreisContextProvider({ children,  saisonpreisePromise }: SaisonpreisContextProviderType) {
    return (
        <SaisonpreisContext.Provider value={{ saisonpreisePromise }}>
            {children}
        </SaisonpreisContext.Provider>
    );
}

export const useSaisonpreisContext = () => {
    const context = useContext(SaisonpreisContext);
    if (!context) {
        throw new Error("useSaisonpreisContext muss in einem SaisonpreisContextProvider verwendet werden");
    }
    return context;
};