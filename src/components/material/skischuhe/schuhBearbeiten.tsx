"use client"
import { Schuh, SchuhModellArray } from "@/types/materialtypes";
import { aendereSchuhMaterial } from "@/lib/materialbearbeitenactions";
import FeldDialog, { FeldWerte, zahlAus } from "../bearbeiten/FeldDialog";

// Bearbeiten-Dialog eines Schuhs, geteilt von Kachel und Tabellenzeile
export function useSchuhBearbeiten(schuh: Schuh, modelle: SchuhModellArray, onGeaendert: () => void) {
    async function speichern(werte: FeldWerte): Promise<string | null> {
        const sohle = zahlAus(werte.Sohle);
        if (sohle !== null && (Number.isNaN(sohle) || !Number.isInteger(sohle) || sohle < 150 || sohle > 400)) {
            return "Sohlenlänge muss eine ganze Zahl zwischen 150 und 400 mm sein.";
        }
        const antwort = await aendereSchuhMaterial(schuh.ID, {
            Modell_ID: Number(werte.Modell_ID),
            // Leer = interne ID als Nummer
            SchuhNr: String(werte.SchuhNr ?? ""),
            Groese: zahlAus(werte.Groese) ?? undefined,
            Sohle: sohle,
            Saison: String(werte.Saison),
            EK: zahlAus(werte.EK) ?? undefined,
            VK: zahlAus(werte.VK) ?? undefined,
        });
        if (!antwort.success) return antwort.error;
        onGeaendert();
        return null;
    }

    const bearbeiten = (
        <FeldDialog
            titel={`Schuh ${schuh.SchuhNr} bearbeiten`}
            startwerte={{
                Modell_ID: String(schuh.Modell_ID),
                SchuhNr: schuh.SchuhNr,
                Groese: String(schuh.Groese),
                Sohle: schuh.Sohle ? String(schuh.Sohle) : "",
                Saison: schuh.Saison,
                EK: String(schuh.EK),
                VK: String(schuh.VK),
            }}
            felder={[
                {
                    name: "Modell_ID", label: "Modell", typ: "auswahl",
                    optionen: modelle.map((m) => ({ wert: String(m.ID), text: `${m.Hersteller.Name} ${m.Modell}${m.Jugend ? " (Jugend)" : ""}` })),
                },
                {
                    name: "SchuhNr", label: "Schuh-Nr.", optional: true,
                    hinweis: `Eigene Nummer, z.B. Inventur-Aufkleber. Leer = interne Nummer ${schuh.ID}.`,
                },
                { name: "Groese", label: "Größe (MP)", typ: "zahl" },
                { name: "Sohle", label: "Sohlenlänge (mm)", typ: "zahl", optional: true },
                { name: "Saison", label: "Saison" },
                { name: "EK", label: "EK (€)", typ: "zahl" },
                { name: "VK", label: "VK (€)", typ: "zahl" },
            ]}
            onSpeichern={speichern}
        />
    );

    return { bearbeiten };
}
