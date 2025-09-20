"use server"

import { config } from "./config";
import { SaisonverleihPreise, SaisonVerleihCreate } from "@/types/saisonverleihtypes";

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

export async function createSaisonVerleih(previousState: unknown,saisonVerleih: SaisonVerleihCreate): Promise<SaisonVerleihCreate | null> {
    console.log("Erstellen:", saisonVerleih);
    
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
