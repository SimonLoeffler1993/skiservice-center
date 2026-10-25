import { useState, useTransition } from "react";
import { format } from "date-fns";

import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import { getBelegung } from "@/lib/saisonverleihactions";
import { VerleihBelegung } from "@/types/saisonverleihtypes";

type Ergebnis = {
    // Für welche Nummer und welchen Zeitraum geprüft wurde
    schluessel: string;
    belegungen: VerleihBelegung[];
    fehler: string | null;
};

/**
 * Prüft, ob Ski oder Schuh schon verliehen sind:
 * Tagesverleih im gewählten Zeitraum (ohne vollständigen Zeitraum inaktiv), Saisonverleih heute.
 */
export function useBelegungPruefung(material: "ski" | "schuh") {
    const { art, zeitraum, verleihId } = useSaisonverleihContext();
    const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);
    const [isPending, startTransition] = useTransition();

    const tagesverleih = art === "tag";
    const heute = format(new Date(), "yyyy-MM-dd");
    const von = tagesverleih ? (zeitraum?.from ? format(zeitraum.from, "yyyy-MM-dd") : null) : heute;
    const bis = tagesverleih ? (zeitraum?.to ? format(zeitraum.to, "yyyy-MM-dd") : null) : heute;
    const aktiv = !!von && !!bis;

    function pruefen(nummer: string) {
        if (!aktiv || !nummer.trim()) {
            setErgebnis(null);
            return;
        }
        const schluessel = `${nummer}|${von}|${bis}`;
        startTransition(async () => {
            const antwort = await getBelegung(
                von!,
                bis!,
                material === "ski" ? { skinr: nummer.trim() } : { schuhnr: Number(nummer) },
                verleihId,
            );
            setErgebnis(antwort.success
                ? { schluessel, belegungen: antwort.data, fehler: null }
                : { schluessel, belegungen: [], fehler: antwort.error });
        });
    }

    // Ergebnis nur gültig, solange Nummer und Zeitraum gleich sind
    function aktuellesErgebnis(nummer: string) {
        return aktiv && ergebnis?.schluessel === `${nummer}|${von}|${bis}` ? ergebnis : null;
    }

    return { aktiv, tagesverleih, pruefen, aktuellesErgebnis, isPending };
}
