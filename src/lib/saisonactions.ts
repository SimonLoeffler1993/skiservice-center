"use server"
import { config } from "@/lib/config";
import { SaisonsNamenListeSchema } from "@/types/saison";

export async function getSaisons() {
    const response = await fetch(`${config.backendUrl}/api/v1/saison/alle`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const data = await response.json();
    const parsedData = SaisonsNamenListeSchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
}