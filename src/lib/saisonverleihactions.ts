"use server"

import { config } from "./config";
import { SaisonverleihPreise, SaisonVerleihCreate, SaisonVerleihCreateResponse, SaisonverleihReadSchema, SaisonverleihRead } from "@/types/saisonverleihtypes";

export async function getSaisonVerleihPreis(): Promise<SaisonverleihPreise> {
    // TODO: Validierung auf das richtige schema
    const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/preise`);
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return { preise: [] };
    }
    const data = await response.json();
    // Ensure we always return the correct structure
    return data || { preise: [] };
}

export async function createSaisonVerleih(previousState: unknown,saisonVerleih: SaisonVerleihCreate): Promise<SaisonVerleihCreateResponse | null> {
    // console.log("Erstellen:", saisonVerleih);
    
    const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/neu`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(saisonVerleih),
    });
    if (!response.ok) {
        console.error("Fehler beim Erstellen:", response);
        return null;
    }
    const data = await response.json();
    // Ensure we always return the correct structure
    return data || null;
}

// Ein SaisonVerleih per ID laden
export async function getSaisonVerleihById(id: number | string): Promise<SaisonverleihRead | null> {
    try {
        const res = await fetch(`${config.backendUrl}/api/v1/saisonverleih/${id}`, { cache: "no-store" });
        if (!res.ok) {
            console.error("Fehler beimLaden SaisonVerleih:", id, res.status, res.statusText);
            return null;
        }
        const json = await res.json();
 
        const candidate = json?.data ?? json;
        const parsed = SaisonverleihReadSchema.safeParse(candidate);
        if (!parsed.success) {
            console.error("Ungültige Antwortstruktur für SaisonVerleih", parsed.error.flatten());
            return null;
        }
    
        return parsed.data;
    } catch (e) {
        console.error("Unerwarteter Fehler beimLaden SaisonVerleih:", e);
        return null;
    }
}
