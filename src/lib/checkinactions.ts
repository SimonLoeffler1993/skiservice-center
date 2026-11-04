"use server";

import { ApiAntwort } from "@/types/actiontypes";
import {
    Checkin,
    CheckinListeSchema,
    CheckinSchluessel,
    CheckinSchluesselListeSchema,
    CheckinSchluesselSchema,
    CheckinStatus,
    CheckinStatusSchema,
    CheckinUebernommen,
    CheckinUebernommenSchema,
} from "@/types/checkintypes";
import { anfrage, LoeschenSchema } from "./apianfrage";

export async function holeCheckins(): Promise<ApiAntwort<Checkin[]>> {
    return anfrage("/checkin/", "GET", CheckinListeSchema, "Check-ins konnten nicht geladen werden.");
}

export async function holeCheckinStatus(): Promise<ApiAntwort<CheckinStatus>> {
    return anfrage("/checkin/status", "GET", CheckinStatusSchema, "Check-in-Status konnte nicht geladen werden.");
}

// Legt den Kunden an und löscht den Check-in aus der Zwischendatenbank
export async function uebernehmeCheckin(id: string): Promise<ApiAntwort<CheckinUebernommen>> {
    return anfrage(`/checkin/${encodeURIComponent(id)}/uebernehmen`, "POST", CheckinUebernommenSchema, "Check-in konnte nicht übernommen werden.");
}

export async function verwerfeCheckin(id: string): Promise<ApiAntwort<{ success: boolean }>> {
    return anfrage(`/checkin/${encodeURIComponent(id)}`, "DELETE", LoeschenSchema, "Check-in konnte nicht verworfen werden.");
}

export async function holeCheckinSchluessel(): Promise<ApiAntwort<CheckinSchluessel[]>> {
    return anfrage("/checkin/schluessel", "GET", CheckinSchluesselListeSchema, "Schlüssel konnten nicht geladen werden.");
}

export async function erzeugeCheckinSchluessel(): Promise<ApiAntwort<CheckinSchluessel>> {
    return anfrage("/checkin/schluessel", "POST", CheckinSchluesselSchema, "Schlüssel konnte nicht erzeugt werden.");
}
