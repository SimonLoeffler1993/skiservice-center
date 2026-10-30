"use server";

import { ApiAntwort } from "@/types/actiontypes";
import { Handware, HandwareDaten, HandwareListeSchema, HandwareSchema } from "@/types/handwaretypes";
import { anfrage, LoeschenSchema } from "./apianfrage";

export async function holeHandware(): Promise<ApiAntwort<Handware[]>> {
    return anfrage("/handware/", "GET", HandwareListeSchema, "Artikel konnten nicht geladen werden.");
}

export async function legeHandwareAn(daten: HandwareDaten): Promise<ApiAntwort<Handware>> {
    return anfrage("/handware/", "POST", HandwareSchema, "Artikel konnte nicht angelegt werden.", daten);
}

export async function aendereHandware(id: number, daten: HandwareDaten): Promise<ApiAntwort<Handware>> {
    return anfrage(`/handware/${id}`, "PATCH", HandwareSchema, "Artikel konnte nicht geändert werden.", daten);
}

export async function loescheHandware(id: number): Promise<ApiAntwort<{ success: boolean }>> {
    return anfrage(`/handware/${id}`, "DELETE", LoeschenSchema, "Artikel konnte nicht gelöscht werden.");
}
