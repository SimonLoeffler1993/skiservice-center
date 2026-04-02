"use server";

import { QuittungRead, QuittungReadSchema } from "@/types/quittungentypes";
import { config } from "./config";

export async function getQuittung(quittungID: number): Promise<QuittungRead | null> {
    const response = await fetch(`${config.backendUrl}/api/v1/quittungen/quittung/${quittungID}?bezahlinfo=true`);
    if (!response.ok) {
        console.error("Fehler beim Abrufen der Quittung:", response);
        return null;
    }
    const data = await response.json();

    // Zod-Validierung
    const parseResult = QuittungReadSchema.safeParse(data);
    if (!parseResult.success) {
        console.error("Fehler bei der Validierung der Quittungsdaten:", parseResult.error);
        return null;
    }
    return parseResult.data;
}