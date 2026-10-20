"use client";

// import { Kunde } from "@/types/skikundentypes";
// import { useSkikundenContext } from "@/context/skikunden-context";
import { useKundeStore } from "@/stores/useKundeStore";
import { Kunde } from "@/types/skikundentypes";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Material } from "@/types/materialtypes";
import { VerleihArt } from "@/types/saisonverleihtypes";

type SaisonverleihContextProviderProps = {
    children: React.ReactNode;
    // Für das Hinzufügen von Material zu einem bestehenden Verleih
    startArt?: VerleihArt;
    startZeitraum?: DateRange;
    verleihId?: number;
};

type SaisonverleihContextType = {
    kunde: Kunde | null;
    setKunde: (kunde: Kunde | null) => void;
    materialList: Material[];
    setMaterialList: (materialList: Material[]) => void;
    datenVollstaendig: boolean;
    bemerkung: string;
    setBemerkung: (bemerkung: string) => void;
    art: VerleihArt;
    setArt: (art: VerleihArt) => void;
    // Nur beim Tagesverleih
    zeitraum: DateRange | undefined;
    setZeitraum: (zeitraum: DateRange | undefined) => void;
    // Gesetzt, wenn Material zu einem bestehenden Verleih hinzugefügt wird
    verleihId: number | undefined;
};

const SaisonverleihContext = React.createContext<SaisonverleihContextType | undefined>(undefined);

export const SaisonverleihContextProvider = ({ children, startArt = "saison", startZeitraum, verleihId }: SaisonverleihContextProviderProps) => {
    const { kunde, setKunde } = useKundeStore();
    const [materialList, setMaterialList] = useState<Material[]>([]);
    const [bemerkung, setBemerkung] = useState("");
    const [art, setArt] = useState<VerleihArt>(startArt);
    const [zeitraum, setZeitraum] = useState<DateRange | undefined>(startZeitraum);

    // Beim Tagesverleih muss zusätzlich der Zeitraum gewählt sein
    const zeitraumOk = art === "saison" || (!!zeitraum?.from && !!zeitraum?.to);
    const datenVollstaendig = !!kunde && materialList.length > 0 && zeitraumOk;
    return (
        <SaisonverleihContext.Provider value={{ kunde, setKunde, materialList, setMaterialList, datenVollstaendig, bemerkung, setBemerkung, art, setArt, zeitraum, setZeitraum, verleihId }}>
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
