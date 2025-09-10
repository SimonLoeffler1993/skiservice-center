"use client";

// import { Kunde } from "@/types/skikundentypes";
import { useSkikundenContext } from "@/context/skikunden-context";
import { Kunde } from "@/types/skikundentypes";
import React from "react";
import { Material } from "@/types/materialtypes";

type SaisonverleihContextProviderProps = {
    children: React.ReactNode;
};

type SaisonverleihContextType = {
    kunde: Kunde | null;
    setKunde: (kunde: Kunde | null) => void;
    materialList: Material[];
    setMaterialList: (materialList: Material[]) => void;
};

const SaisonverleihContext = React.createContext<SaisonverleihContextType | undefined>(undefined);

export const SaisonverleihContextProvider = ({ children }: SaisonverleihContextProviderProps) => {
    const { kunde, setKunde } = useSkikundenContext();
    const [materialList, setMaterialList] = React.useState<Material[]>([]);
    return (
        <SaisonverleihContext.Provider value={{ kunde, setKunde, materialList, setMaterialList }}>
            {children}
        </SaisonverleihContext.Provider>
    );
};

export const useSaisonverleihContext = () => {
    const context = React.useContext(SaisonverleihContext);
    if (!context) {
        throw new Error("useSaisonverleihContext must be used within a SaisonverleihContextProvider");
    }
    return context;
};
