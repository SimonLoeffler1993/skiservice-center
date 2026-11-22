"use server";

import { z } from "zod";

import { ApiAntwort } from "@/types/actiontypes";
import {
    Geraeteschluessel, GeraeteschluesselErzeugtSchema, GeraeteschluesselSchema, Geraetesitzung, GeraetesitzungSchema,
} from "@/types/benutzer";
import { anfrage, LoeschenSchema } from "./apianfrage";

export async function holeGeraeteschluessel(): Promise<ApiAntwort<Geraeteschluessel[]>> {
    return anfrage("/geraete/schluessel", "GET", z.array(GeraeteschluesselSchema), "Geräteschlüssel konnten nicht geladen werden.");
}

export async function legeGeraeteschluesselAn(name: string, bereich: "scanner" | "terminal"): Promise<ApiAntwort<z.infer<typeof GeraeteschluesselErzeugtSchema>>> {
    return anfrage("/geraete/schluessel", "POST", GeraeteschluesselErzeugtSchema, "Geräteschlüssel konnte nicht erzeugt werden.", { name, bereich });
}

export async function aendereGeraeteschluessel(id: number, daten: { name?: string; aktiv?: boolean }): Promise<ApiAntwort<Geraeteschluessel>> {
    return anfrage(`/geraete/schluessel/${id}`, "PATCH", GeraeteschluesselSchema, "Geräteschlüssel konnte nicht geändert werden.", daten);
}

export async function loescheGeraeteschluessel(id: number): Promise<ApiAntwort<z.infer<typeof LoeschenSchema>>> {
    return anfrage(`/geraete/schluessel/${id}`, "DELETE", LoeschenSchema, "Geräteschlüssel konnte nicht gelöscht werden.");
}

export async function holeGeraetesitzungen(): Promise<ApiAntwort<Geraetesitzung[]>> {
    return anfrage("/geraete/sitzungen", "GET", z.array(GeraetesitzungSchema), "Angemeldete Geräte konnten nicht geladen werden.");
}

export async function aendereGeraetesitzung(id: number, daten: { name?: string; bediener_timeout_minuten?: number | null }): Promise<ApiAntwort<z.infer<typeof LoeschenSchema>>> {
    return anfrage(`/geraete/sitzungen/${id}`, "PATCH", LoeschenSchema, "Gerät konnte nicht geändert werden.", daten);
}

export async function meldeGeraetAb(id: number): Promise<ApiAntwort<z.infer<typeof LoeschenSchema>>> {
    return anfrage(`/geraete/sitzungen/${id}`, "DELETE", LoeschenSchema, "Gerät konnte nicht abgemeldet werden.");
}
