"use server";

import { z } from "zod";

import { ApiAntwort } from "@/types/actiontypes";
import {
    Gruppe, GruppeDaten, GruppeSchema, RechtInfo, RechtInfoSchema, Rolle, RolleDaten, RolleSchema,
} from "@/types/benutzer";
import { anfrage, LoeschenSchema } from "./apianfrage";

export async function holeRechteKatalog(): Promise<ApiAntwort<RechtInfo[]>> {
    return anfrage("/rollen/rechte", "GET", z.array(RechtInfoSchema), "Rechte konnten nicht geladen werden.");
}

export async function holeRollen(): Promise<ApiAntwort<Rolle[]>> {
    return anfrage("/rollen/", "GET", z.array(RolleSchema), "Rollen konnten nicht geladen werden.");
}

export async function legeRolleAn(daten: RolleDaten): Promise<ApiAntwort<Rolle>> {
    return anfrage("/rollen/", "POST", RolleSchema, "Rolle konnte nicht angelegt werden.", daten);
}

export async function aendereRolle(id: number, daten: RolleDaten): Promise<ApiAntwort<Rolle>> {
    return anfrage(`/rollen/${id}`, "PATCH", RolleSchema, "Rolle konnte nicht geändert werden.", daten);
}

export async function loescheRolle(id: number): Promise<ApiAntwort<z.infer<typeof LoeschenSchema>>> {
    return anfrage(`/rollen/${id}`, "DELETE", LoeschenSchema, "Rolle konnte nicht gelöscht werden.");
}

export async function holeGruppen(): Promise<ApiAntwort<Gruppe[]>> {
    return anfrage("/gruppen/", "GET", z.array(GruppeSchema), "Gruppen konnten nicht geladen werden.");
}

export async function legeGruppeAn(daten: GruppeDaten): Promise<ApiAntwort<Gruppe>> {
    return anfrage("/gruppen/", "POST", GruppeSchema, "Gruppe konnte nicht angelegt werden.", daten);
}

export async function aendereGruppe(id: number, daten: GruppeDaten): Promise<ApiAntwort<Gruppe>> {
    return anfrage(`/gruppen/${id}`, "PATCH", GruppeSchema, "Gruppe konnte nicht geändert werden.", daten);
}

export async function loescheGruppe(id: number): Promise<ApiAntwort<z.infer<typeof LoeschenSchema>>> {
    return anfrage(`/gruppen/${id}`, "DELETE", LoeschenSchema, "Gruppe konnte nicht gelöscht werden.");
}
