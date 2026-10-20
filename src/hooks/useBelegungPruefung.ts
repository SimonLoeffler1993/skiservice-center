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
 * Prüft beim Tagesverleih, ob Ski oder Schuh im gewählten Zeitraum schon verliehen sind.
 * Beim Saisonverleih oder ohne vollständigen Zeitraum ist die Prüfung inaktiv.
 */
export function useBelegungPruefung(material: "ski" | "schuh") {
    const { art, zeitraum, verleihId } = useSaisonverleihContext();
    const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);
    const [isPending, startTransition] = useTransition();

    const von = zeitraum?.from ? format(zeitraum.from, "yyyy-MM-dd") : null;
    const bis = zeitraum?.to ? format(zeitraum.to, "yyyy-MM-dd") : null;
    const aktiv = art === "tag" && !!von && !!bis;

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

    return { aktiv, pruefen, aktuellesErgebnis, isPending };
}
