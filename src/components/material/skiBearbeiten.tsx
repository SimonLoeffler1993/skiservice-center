"use client"
import { useState } from "react";

import { ModellArray, Ski } from "@/types/materialtypes";
import { aendereSkiMaterial } from "@/lib/materialbearbeitenactions";
import FeldDialog, { FeldWerte, zahlAus } from "./bearbeiten/FeldDialog";

export const formatMaterialEUR = (n: number) =>
    new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

// Bearbeiten-Dialog eines Skis, geteilt von Kachel und Tabellenzeile
export function useSkiBearbeiten(ski: Ski, modelle: ModellArray, onGeaendert: () => void) {
    const [meldung, setMeldung] = useState<string | null>(null);

    async function speichern(werte: FeldWerte): Promise<string | null> {
        const antwort = await aendereSkiMaterial(ski.ID, {
            Modell_ID: Number(werte.Modell_ID),
            SkiNr: String(werte.SkiNr),
            Laenge: zahlAus(werte.Laenge) ?? undefined,
            Saison: String(werte.Saison),
            EK: zahlAus(werte.EK) ?? undefined,
            VK: zahlAus(werte.VK) ?? undefined,
        });
        if (!antwort.success) return antwort.error;
        const anzahl = antwort.data.UmgestellteVerleihe;
        setMeldung(anzahl > 0 ? `Ski-Nr. geändert, ${anzahl} ${anzahl === 1 ? "Verleih" : "Verleihe"} umgestellt.` : null);
        onGeaendert();
        return null;
    }

    const bearbeiten = (
        <FeldDialog
            titel={`Ski ${ski.SkiNr} bearbeiten`}
            startwerte={{
                Modell_ID: String(ski.Modell_ID),
                SkiNr: ski.SkiNr,
                Laenge: String(ski.Laenge),
                Saison: ski.Saison,
                EK: String(ski.EK),
                VK: String(ski.VK),
            }}
            felder={[
                {
                    name: "Modell_ID", label: "Modell", typ: "auswahl",
                    optionen: modelle.map((m) => ({ wert: String(m.ID), text: `${m.Hersteller.Name} ${m.Modell}` })),
                },
                {
                    name: "SkiNr", label: "Ski-Nr.",
                    hinweis: ski.ImVerleih
                        ? "Bestehende Verleihe werden auf die neue Nummer umgestellt. Bereits gedruckte Etiketten zeigen noch die alte Nummer."
                        : undefined,
                },
                { name: "Laenge", label: "Länge (cm)", typ: "zahl" },
                { name: "Saison", label: "Saison" },
                { name: "EK", label: "EK (€)", typ: "zahl" },
                { name: "VK", label: "VK (€)", typ: "zahl" },
            ]}
            onSpeichern={speichern}
        />
    );

    return { bearbeiten, meldung };
}
