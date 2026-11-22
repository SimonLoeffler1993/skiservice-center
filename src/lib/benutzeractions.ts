"use server";

import { z } from "zod";

import { ApiAntwort } from "@/types/actiontypes";
import { Benutzer, BenutzerAendern, BenutzerAnlegen, BenutzerListeSchema, BenutzerSchema } from "@/types/benutzer";
import { anfrage, LoeschenSchema } from "./apianfrage";

export async function holeBenutzer(): Promise<ApiAntwort<Benutzer[]>> {
    return anfrage("/benutzer/", "GET", BenutzerListeSchema, "Benutzer konnten nicht geladen werden.");
}

export async function legeBenutzerAn(daten: BenutzerAnlegen): Promise<ApiAntwort<Benutzer>> {
    return anfrage("/benutzer/", "POST", BenutzerSchema, "Benutzer konnte nicht angelegt werden.", daten);
}

export async function aendereBenutzer(id: number, daten: BenutzerAendern): Promise<ApiAntwort<Benutzer>> {
    return anfrage(`/benutzer/${id}`, "PATCH", BenutzerSchema, "Benutzer konnte nicht geändert werden.", daten);
}

export async function setzeBenutzerPasswort(id: number, passwort: string): Promise<ApiAntwort<Benutzer>> {
    return anfrage(`/benutzer/${id}/passwort`, "POST", BenutzerSchema, "Passwort konnte nicht gesetzt werden.", { passwort });
}

export async function loescheBenutzerPin(id: number): Promise<ApiAntwort<Benutzer>> {
    return anfrage(`/benutzer/${id}/pin`, "DELETE", BenutzerSchema, "PIN konnte nicht gelöscht werden.");
}

export async function entsperreBenutzer(id: number): Promise<ApiAntwort<Benutzer>> {
    return anfrage(`/benutzer/${id}/entsperren`, "POST", BenutzerSchema, "Benutzer konnte nicht entsperrt werden.");
}

export async function loeseBenutzerOidc(id: number): Promise<ApiAntwort<Benutzer>> {
    return anfrage(`/benutzer/${id}/oidc`, "DELETE", BenutzerSchema, "Verknüpfung konnte nicht gelöst werden.");
}

export async function uebernimmOidc(id: number, vonBenutzerId: number): Promise<ApiAntwort<Benutzer>> {
    return anfrage(`/benutzer/${id}/oidc-uebernehmen`, "POST", BenutzerSchema, "Übernehmen fehlgeschlagen.", { von_benutzer_id: vonBenutzerId });
}

export async function loescheBenutzer(id: number): Promise<ApiAntwort<z.infer<typeof LoeschenSchema>>> {
    return anfrage(`/benutzer/${id}`, "DELETE", LoeschenSchema, "Benutzer konnte nicht gelöscht werden.");
}
