"use server"

// Bearbeiten und Löschen von Skiservice Aufträgen und Verleihen

import { anfrage, LoeschenSchema } from "./apianfrage";
import { Auftrag, AuftragSchema } from "@/types/skiservicetypes";
import { SaisonverleihRead, SaisonverleihReadSchema, VerleihArt, VerleihStatus } from "@/types/saisonverleihtypes";
import type { Bindungsdaten } from "@/types/bindungsdatentypes";
import { ApiAntwort } from "@/types/actiontypes";

// --- Skiservice ---

export type SkiDaten = {
    service: string;
    preis: number;
    komentar?: string | null;
    bindung_check: boolean;
    bindung_preis: number;
    // null entfernt die Bindungsdaten
    bindungsdaten?: Bindungsdaten | null;
    vorlage_id?: number | null;
    // Ski bzw. Schuh bewusst übernehmen, obwohl sie schon verliehen sind
    trotz_belegung?: boolean;
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
    // null entfernt die Bindungsdaten
    bindungsdaten?: Bindungsdaten | null;
    vorlage_id?: number | null;
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

// Bindungen als geprüft markieren, ohne materialIds alle mit Ski. Sind alle geprüft, wird der Verleih "vorbereitet"
export async function pruefeVerleihBindungen(verleihId: number, materialIds?: number[]): Promise<ApiAntwort<SaisonverleihRead>> {
    return anfrage(`/saisonverleih/${verleihId}/bindung-geprueft`, "POST", SaisonverleihReadSchema, "Bindung konnte nicht als geprüft markiert werden.", { material_ids: materialIds ?? null });
}

// Status setzen: vorbereitung -> vorbereitet -> unterwegs (abgeholt) -> zurueck, auch rückwärts zum Korrigieren
export async function setzeVerleihStatus(verleihId: number, status: VerleihStatus): Promise<ApiAntwort<SaisonverleihRead>> {
    return anfrage(`/saisonverleih/${verleihId}/status`, "PATCH", SaisonverleihReadSchema, "Status konnte nicht geändert werden.", { Status: status });
}
