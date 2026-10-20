"use client";

// import { Kunde } from "@/types/skikundentypes";
// import { useSkikundenContext } from "@/context/skikunden-context";
import { useKundeStore } from "@/stores/useKundeStore";
import { Kunde } from "@/types/skikundentypes";
import React, { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";
import { format, isValid, parseISO } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Material } from "@/types/materialtypes";
import { VerleihArt } from "@/types/saisonverleihtypes";

type SaisonverleihContextProviderProps = {
    children: React.ReactNode;
    // Für das Hinzufügen von Material zu einem bestehenden Verleih
    startArt?: VerleihArt;
    startZeitraum?: DateRange;
    verleihId?: number;
    // Art und Zeitraum aus der URL lesen und dort speichern (?art=tag&von=JJJJ-MM-TT&bis=JJJJ-MM-TT)
    artAusUrl?: boolean;
};

function datumAusUrl(wert: string | null): Date | undefined {
    if (!wert) return undefined;
    const datum = parseISO(wert);
    return isValid(datum) ? datum : undefined;
}

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

export const SaisonverleihContextProvider = ({ children, startArt = "saison", startZeitraum, verleihId, artAusUrl = false }: SaisonverleihContextProviderProps) => {
    const { kunde, setKunde } = useKundeStore();
    const [materialList, setMaterialList] = useState<Material[]>([]);
    const [bemerkung, setBemerkung] = useState("");
    const [artState, setArtState] = useState<VerleihArt>(startArt);
    const [zeitraumState, setZeitraumState] = useState<DateRange | undefined>(startZeitraum);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const urlAendern = useCallback((werte: Record<string, string | null>) => {
        const parameter = new URLSearchParams(searchParams.toString());
        for (const [schluessel, wert] of Object.entries(werte)) {
            if (wert) parameter.set(schluessel, wert);
            else parameter.delete(schluessel);
        }
        const query = parameter.toString();
        // replace statt push, damit nicht jeder Klick im Kalender im Verlauf landet
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [searchParams, router, pathname]);

    // Mit artAusUrl ist die URL die Quelle, sonst der lokale State
    const urlVon = datumAusUrl(searchParams.get("von"));
    const art: VerleihArt = artAusUrl ? (searchParams.get("art") === "tag" ? "tag" : "saison") : artState;
    const zeitraum: DateRange | undefined = artAusUrl
        ? (urlVon ? { from: urlVon, to: datumAusUrl(searchParams.get("bis")) } : undefined)
        : zeitraumState;

    const setArt = useCallback((neueArt: VerleihArt) => {
        if (!artAusUrl) return setArtState(neueArt);
        // Beim Saisonverleih gibt es keinen Zeitraum
        urlAendern(neueArt === "tag" ? { art: "tag" } : { art: null, von: null, bis: null });
    }, [artAusUrl, urlAendern]);

    const setZeitraum = useCallback((neuerZeitraum: DateRange | undefined) => {
        if (!artAusUrl) return setZeitraumState(neuerZeitraum);
        urlAendern({
            von: neuerZeitraum?.from ? format(neuerZeitraum.from, "yyyy-MM-dd") : null,
            bis: neuerZeitraum?.to ? format(neuerZeitraum.to, "yyyy-MM-dd") : null,
        });
    }, [artAusUrl, urlAendern]);

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
