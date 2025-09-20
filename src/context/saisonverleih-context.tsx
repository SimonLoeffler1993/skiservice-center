"use client";

// import { Kunde } from "@/types/skikundentypes";
import { useSkikundenContext } from "@/context/skikunden-context";
import { Kunde } from "@/types/skikundentypes";
import React, { useEffect, useState } from "react";
import { Material } from "@/types/materialtypes";

type SaisonverleihContextProviderProps = {
    children: React.ReactNode;
};

type SaisonverleihContextType = {
    kunde: Kunde | null;
    setKunde: (kunde: Kunde | null) => void;
    materialList: Material[];
    setMaterialList: (materialList: Material[]) => void;
    datenVollstaendig: boolean;
    bemerkung: string;
    setBemerkung: (bemerkung: string) => void;
};

const SaisonverleihContext = React.createContext<SaisonverleihContextType | undefined>(undefined);

export const SaisonverleihContextProvider = ({ children }: SaisonverleihContextProviderProps) => {
    const { kunde, setKunde } = useSkikundenContext();
    const [materialList, setMaterialList] = useState<Material[]>([]);
    const [datenVollstaendig, setDatenVollstaendig] = useState(false);
    const [bemerkung, setBemerkung] = useState("");

    useEffect(() => {
        if (kunde && materialList.length > 0) {
            setDatenVollstaendig(true);
        }else{
            setDatenVollstaendig(false);
        }
    }, [kunde, materialList]);
    return (
        <SaisonverleihContext.Provider value={{ kunde, setKunde, materialList, setMaterialList, datenVollstaendig, bemerkung, setBemerkung }}>
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
