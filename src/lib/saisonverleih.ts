import { config } from "./config";
import { SaisonverleihPreise } from "@/types/saisonverleihtypes";

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
