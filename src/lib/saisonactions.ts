"use server"
import { unstable_cache, updateTag } from "next/cache";

import { config } from "@/lib/config";
import { ApiAntwort } from "@/types/actiontypes";
import { SaisonDaten, SaisonsNamen, SaisonsNamenListeSchema, SaisonsNamenSchema } from "@/types/saison";

const SAISON_TAG = "saison";

// Saisons ändern sich selten, daher 5 Minuten im Server Cache halten.
// Fehler werden geworfen und dadurch nicht gecacht.
const ladeSaisonsGecacht = unstable_cache(
    async () => {
        const response = await fetch(`${config.backendUrl}/api/v1/saison/alle`, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Backend antwortet mit ${response.status}`);
        }
        const parsedData = SaisonsNamenListeSchema.safeParse(await response.json());
        if (!parsedData.success) {
            throw new Error("Saisons haben ein ungültiges Format");
        }
        return parsedData.data;
    },
    ["saisons-alle"],
    { revalidate: 300, tags: [SAISON_TAG] }
);

/**
 * Lädt alle Saisons und ermittelt die aktuelle Saison.
 * Unterscheidet "Backend nicht erreichbar" (success: false) von "keine Saison vorhanden" (aktuelle: undefined).
 */
export async function getSaisonDaten(): Promise<ApiAntwort<SaisonDaten>> {
    try {
        const saisons = await ladeSaisonsGecacht();
        return {
            success: true,
            data: {
                saisons,
                aktuelle: saisons.find((saison) => saison.Verwendet === 1),
            },
        };
    } catch (error) {
        console.error("Fehler beim Laden der Saisons:", error);
        return { success: false, error: "Das Backend ist nicht erreichbar. Bitte später erneut versuchen." };
    }
}

export async function saisonAnlegen(name: string, von: string, bis: string): Promise<ApiAntwort<SaisonsNamen>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/saison/erfassen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Start: von,
                Ende: bis,
                Name: name,
                Verwendet: 1
             })
        });
        if (!response.ok) {
            console.error("Fehler beim Anlegen der Saison:", response.status);
            return { success: false, error: "Saison konnte nicht angelegt werden." };
        }
        const parsedData = SaisonsNamenSchema.safeParse(await response.json());
        if (!parsedData.success) {
            return { success: false, error: "Ungültige Antwort vom Backend." };
        }

        // Cache sofort leeren, damit die neue Saison überall angezeigt wird
        updateTag(SAISON_TAG);
        return { success: true, data: parsedData.data };
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return { success: false, error: "Das Backend ist nicht erreichbar." };
    }
}
