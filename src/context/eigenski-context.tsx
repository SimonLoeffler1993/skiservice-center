"use client"
import { createContext, useContext, useState } from "react";
import { SkiArray } from "@/types/materialtypes";
import { getSkiList } from "@/lib/materialactions";

export type EigenSkiContextType = {
    eigenSkisPromise: Promise<SkiArray>;
    refreshEigenSkisPromise: () => void;
}

const EigenSkiContext = createContext<EigenSkiContextType | null>(null);

type EigenSkiContextProviderType = {
    children: React.ReactNode;
    eigenSkisPromise: Promise<SkiArray>;
}

export function EigenSkiContextProvider({ children , eigenSkisPromise }: EigenSkiContextProviderType) {
    // State stellt Reload sicher
    const [statefulPromise, setStatefulPromise] = useState<Promise<SkiArray>>(eigenSkisPromise);
    function refreshEigenSkisPromise() {
        setStatefulPromise(getSkiList());
    }
    return (
    <EigenSkiContext.Provider value={{ eigenSkisPromise: statefulPromise, refreshEigenSkisPromise }}>
        {children}
    </EigenSkiContext.Provider>
    );
}

export const useEigenSkiContext = () => {
    const context = useContext(EigenSkiContext);
    if (!context) {
        throw new Error("useEigenSkiContext muss in einem EigenSkiContextProvider verwendet werden");
    }
    return context;
};
