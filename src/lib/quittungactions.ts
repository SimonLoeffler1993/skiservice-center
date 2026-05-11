"use server";

import { QuittungRead, QuittungReadSchema } from "@/types/quittungentypes";
import { config } from "./config";
import { Beleg } from "@/types/belegetypes";
import { LexPages } from "@/types/pagestypes";

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

export async function getQuittungsBelegeListe(page: number = 0): Promise<LexPages<Beleg> | null> {
    const response = await fetch(`${config.backendUrl}/api/v1/quittungen/lexware/belege?page=${page}`);
    if (!response.ok) {
        console.error("Fehler beim Abrufen der Belegliste:", response);
        return null;
    }
    const data = await response.json();

    // TODO: ZOD-Validierung könnte hier hinzugefügt werden, wenn ein entsprechendes Schema definiert ist.
    return data as LexPages<Beleg>;
}

export async function setExQuittungBeleg(lexBelegID: string, saisonVerleihID: number): Promise<boolean> {
    const response = await fetch(`${config.backendUrl}/api/v1/quittungen/quittung/nurextern`, {
        method: "POST",
        body: JSON.stringify({
            SaisonverleihID: saisonVerleihID,
            LexOfficeID: lexBelegID
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        console.error("Fehler beim Zuweisen der Quittung zum Beleg:", response);
        return false;
    }
    return true;
}