"use server"

import { config } from "./config";
import { toApiAntwort } from "./helfer";
import { ApiAntwort } from "@/types/actiontypes";
import { EinstellungenListe, EinstellungenListeSchema, EinstellungenWerte, TestErgebnis, TestErgebnisSchema } from "@/types/einstellungentypes";

const basisUrl = () => `${config.backendUrl}/api/v1/einstellungen`;

async function fehlerText(response: Response, standard: string): Promise<string> {
    const daten = await response.json().catch(() => null);
    return typeof daten?.detail === "string" ? daten.detail : standard;
}

export async function getEinstellungen(): Promise<ApiAntwort<EinstellungenListe>> {
    try {
        const response = await fetch(`${basisUrl()}/`, { cache: "no-store" });
        if (!response.ok) {
            return { success: false, error: await fehlerText(response, "Einstellungen konnten nicht geladen werden.") };
        }
        return toApiAntwort(EinstellungenListeSchema.safeParse(await response.json()), "Einstellungen haben ein ungültiges Format.");
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return { success: false, error: "Das Backend ist nicht erreichbar." };
    }
}

export async function speichereEinstellungen(werte: EinstellungenWerte): Promise<ApiAntwort<EinstellungenListe>> {
    try {
        const response = await fetch(`${basisUrl()}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ werte }),
        });
        if (!response.ok) {
            return { success: false, error: await fehlerText(response, "Einstellungen konnten nicht gespeichert werden.") };
        }
        return toApiAntwort(EinstellungenListeSchema.safeParse(await response.json()), "Ungültige Antwort vom Backend.");
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return { success: false, error: "Das Backend ist nicht erreichbar." };
    }
}

export async function loescheGeheimnis(schluessel: string): Promise<ApiAntwort<EinstellungenListe>> {
    try {
        const response = await fetch(`${basisUrl()}/${encodeURIComponent(schluessel)}`, { method: "DELETE" });
        if (!response.ok) {
            return { success: false, error: await fehlerText(response, "Wert konnte nicht gelöscht werden.") };
        }
        return toApiAntwort(EinstellungenListeSchema.safeParse(await response.json()), "Ungültige Antwort vom Backend.");
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return { success: false, error: "Das Backend ist nicht erreichbar." };
    }
}

export type TestArt = "mail" | "drucker" | "lexware";

export async function testeEinstellung(art: TestArt, empfaenger?: string): Promise<TestErgebnis> {
    try {
        const response = await fetch(`${basisUrl()}/test/${art}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: art === "mail" ? JSON.stringify({ empfaenger }) : undefined,
        });
        if (!response.ok) {
            return { success: false, message: await fehlerText(response, "Test fehlgeschlagen.") };
        }
        const parsed = TestErgebnisSchema.safeParse(await response.json());
        return parsed.success ? parsed.data : { success: false, message: "Ungültige Antwort vom Backend." };
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return { success: false, message: "Das Backend ist nicht erreichbar." };
    }
}
