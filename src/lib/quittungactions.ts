"use server";

import { QuittungListeEintrag, QuittungListeSchema, QuittungRead, QuittungReadSchema } from "@/types/quittungentypes";
import { config } from "./config";
import { anfrage } from "./apianfrage";
import { ApiAntwort } from "@/types/actiontypes";
import { Beleg } from "@/types/belegetypes";
import { LexPages } from "@/types/pagestypes";
import { z } from "zod";

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

// Wem die externe Quittung zugewiesen wird
export type QuittungZiel = { art: "verleih" | "auftrag"; id: number };

// ersetzen: bereits von Hand zugewiesenen Beleg ändern (z.B. nach einem Vertipper)
export async function setExQuittungBeleg(lexBelegID: string, ziel: QuittungZiel, ersetzen = false): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/quittungen/quittung/nurextern`, {
            method: "POST",
            body: JSON.stringify({
                ...(ziel.art === "verleih" ? { SaisonverleihID: ziel.id } : { AuftragID: ziel.id }),
                LexOfficeID: lexBelegID,
                ersetzen,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            const daten = await response.json().catch(() => null);
            return { success: false, error: typeof daten?.detail === "string" ? daten.detail : "Die Quittung konnte nicht zugewiesen werden." };
        }
        return { success: true };
    } catch (error) {
        console.error("Fehler beim Zuweisen der Quittung:", error);
        return { success: false, error: "Server nicht erreichbar." };
    }
}
// Von Hand zugewiesenen Lexware-Beleg wieder lösen, der Beleg in Lexware bleibt unverändert
export async function hebeQuittungZuweisungAuf(ziel: QuittungZiel): Promise<ApiAntwort<{ erfolgreich: boolean }>> {
    const parameter = ziel.art === "verleih" ? `SaisonverleihID=${ziel.id}` : `AuftragID=${ziel.id}`;
    return anfrage(`/quittungen/quittung/zuweisung?${parameter}`, "DELETE", z.object({ erfolgreich: z.boolean() }), "Die Zuweisung konnte nicht aufgehoben werden.");
}

// Eigene Quittung als Beleg mit PDF nach Lexware hochladen
export async function quittungNachLexware(quittungID: number): Promise<ApiAntwort<QuittungRead>> {
    return anfrage(`/quittungen/quittung/${quittungID}/lexware`, "POST", QuittungReadSchema, "Quittung konnte nicht an Lexware übertragen werden.");
}

// Alle Quittungen einer Saison, neueste zuerst
export async function getQuittungenListe(saisonID: number): Promise<QuittungListeEintrag[]> {
    const antwort = await anfrage(`/quittungen/liste?saison=${saisonID}`, "GET", QuittungListeSchema, "Quittungen konnten nicht geladen werden.");
    if (!antwort.success) throw new Error(antwort.error);
    return antwort.data;
}
