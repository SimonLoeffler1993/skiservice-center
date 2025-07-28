"use client"

import { Kunde } from "@/types/skikundentypes";
import React from "react";

type SkikundenContextProviderProps = {
    children: React.ReactNode;
};

type SkikundenContextType = {
    kunde: Kunde | null;
    setKunde: (kunde: Kunde | null) => void;
};

const SkikundenContext = React.createContext<SkikundenContextType | undefined>(undefined);

export const SkikundenContextProvider = ({ children }: SkikundenContextProviderProps) => {
    const [kunde, setKunde] = React.useState<Kunde | null>(null);
    return (
        <SkikundenContext.Provider value={{ kunde, setKunde }}>
            {children}
        </SkikundenContext.Provider>
    );
};

export const useSkikundenContext = () => {
    const context = React.useContext(SkikundenContext);
    if (!context) {
        throw new Error("useSkikundenContext must be used within a SkikundenContextProvider");
    }
    return context;
};
