"use server"

// Bearbeiten und Löschen von Skiservice Aufträgen und Verleihen

import { z } from "zod";

import { config } from "./config";
import { toApiAntwort } from "./helfer";
import { ApiAntwort } from "@/types/actiontypes";
import { Auftrag, AuftragSchema } from "@/types/skiservicetypes";
import { SaisonverleihRead, SaisonverleihReadSchema, VerleihArt } from "@/types/saisonverleihtypes";

async function fehlerText(response: Response, standard: string): Promise<string> {
    const daten = await response.json().catch(() => null);
    return typeof daten?.detail === "string" ? daten.detail : standard;
}

async function anfrage<T>(
    pfad: string,
    methode: "POST" | "PATCH" | "DELETE",
    schema: z.ZodType<T>,
    fehler: string,
    body?: unknown,
): Promise<ApiAntwort<T>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1${pfad}`, {
            method: methode,
            headers: { "Content-Type": "application/json" },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        if (!response.ok) {
            return { success: false, error: await fehlerText(response, fehler) };
        }
        return toApiAntwort(schema.safeParse(await response.json()), "Ungültige Antwort vom Server.");
    } catch (error) {
        console.error(fehler, error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}

const LoeschenSchema = z.object({ success: z.boolean() });

// --- Skiservice ---

export type SkiDaten = {
    service: string;
    preis: number;
    komentar?: string | null;
    bindung_check: boolean;
    bindung_preis: number;
};

export async function aendereAuftrag(auftragId: number, daten: { kunden_id?: number; abhol_date?: string }): Promise<ApiAntwort<Auftrag>> {
    return anfrage(`/skiservice/auftrag/${auftragId}`, "PATCH", AuftragSchema, "Auftrag konnte nicht geändert werden.", daten);
}

export async function loescheAuftrag(auftragId: number): Promise<ApiAntwort<{ success: boolean }>> {
    return anfrage(`/skiservice/auftrag/${auftragId}`, "DELETE", LoeschenSchema, "Auftrag konnte nicht gelöscht werden.");
}

export async function fuegeSkiHinzu(auftragId: number, ski: SkiDaten): Promise<ApiAntwort<Auftrag>> {
    return anfrage(`/skiservice/auftrag/${auftragId}/ski`, "POST", AuftragSchema, "Ski konnte nicht hinzugefügt werden.", ski);
}

export async function aendereSki(auftragId: number, skiId: number, daten: Partial<SkiDaten> & { status?: 0 | 1 }): Promise<ApiAntwort<Auftrag>> {
    return anfrage(`/skiservice/auftrag/${auftragId}/ski/${skiId}`, "PATCH", AuftragSchema, "Ski konnte nicht geändert werden.", daten);
}

export async function entferneSki(auftragId: number, skiId: number): Promise<ApiAntwort<Auftrag>> {
    return anfrage(`/skiservice/auftrag/${auftragId}/ski/${skiId}`, "DELETE", AuftragSchema, "Ski konnte nicht entfernt werden.");
}

// --- Saisonverleih ---

export type VerleihAenderung = {
    Bemerkung?: string | null;
    Art?: VerleihArt;
    Start_Am?: string;
    Ende_Am?: string | null;
};

export type MaterialDaten = {
    Preis?: number;
    skinr?: string | null;
    schuhnr?: number | null;
    stockbez_ID?: number | null;
    stocklaenge?: number | null;
    SkiFahrerName?: string | null;
};

export async function aendereVerleih(verleihId: number, daten: VerleihAenderung): Promise<ApiAntwort<SaisonverleihRead>> {
    return anfrage(`/saisonverleih/${verleihId}`, "PATCH", SaisonverleihReadSchema, "Verleih konnte nicht geändert werden.", daten);
}

export async function loescheVerleih(verleihId: number): Promise<ApiAntwort<{ success: boolean }>> {
    return anfrage(`/saisonverleih/${verleihId}`, "DELETE", LoeschenSchema, "Verleih konnte nicht gelöscht werden.");
}

export async function fuegeMaterialHinzu(verleihId: number, material: MaterialDaten): Promise<ApiAntwort<SaisonverleihRead>> {
    return anfrage(`/saisonverleih/${verleihId}/material`, "POST", SaisonverleihReadSchema, "Material konnte nicht hinzugefügt werden.", material);
}

export async function aendereMaterial(verleihId: number, materialId: number, daten: MaterialDaten): Promise<ApiAntwort<SaisonverleihRead>> {
    return anfrage(`/saisonverleih/${verleihId}/material/${materialId}`, "PATCH", SaisonverleihReadSchema, "Material konnte nicht geändert werden.", daten);
}

export async function entferneMaterial(verleihId: number, materialId: number): Promise<ApiAntwort<SaisonverleihRead>> {
    return anfrage(`/saisonverleih/${verleihId}/material/${materialId}`, "DELETE", SaisonverleihReadSchema, "Material konnte nicht entfernt werden.");
}
