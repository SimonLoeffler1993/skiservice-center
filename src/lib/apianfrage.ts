// Gemeinsamer Helfer für Server Actions, die Daten an die API schicken.
// Kein "use server": wird nur aus Server Actions aufgerufen.

import { z } from "zod";

import { config } from "./config";
import { toApiAntwort } from "./helfer";
import { leseTokens, loescheAlles, loescheBediener } from "./sitzung";
import { ApiAntwort } from "@/types/actiontypes";

/**
 * fetch an die API mit der Anmeldung aus den Cookies (Bearer). Gleiche Signatur wie fetch.
 * Ein ausdrücklich gesetzter Authorization-Header bleibt (z.B. Geräte-Token für die PIN-Anmeldung).
 * Bei 401 werden die abgelaufenen Cookies gelöscht; die Weiterleitung zur Anmeldung übernehmen
 * proxy.ts (nächster Seitenaufruf) und der BenutzerProvider im Browser.
 */
export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
    const kopf = new Headers(init.headers);
    if (!kopf.has("Authorization")) {
        const tokens = await leseTokens();
        const token = tokens.bediener ?? tokens.geraet;
        if (token) kopf.set("Authorization", `Bearer ${token}`);
    }
    const response = await fetch(url, { ...init, headers: kopf });
    if (response.status === 401) {
        const detail = await response.clone().json().then((d) => d?.detail).catch(() => null);
        if (detail === "bediener_noetig") await loescheBediener();
        else if (detail === "anmeldung_noetig") await loescheAlles();
    }
    return response;
}

async function fehlerText(response: Response, standard: string): Promise<string> {
    const daten = await response.json().catch(() => null);
    if (typeof daten?.detail === "string") return daten.detail;
    // Validierungsfehler (422): Liste mit {msg}, z.B. "Value error, Mindestens Vorname oder Nachname angeben"
    if (Array.isArray(daten?.detail)) {
        const meldungen = daten.detail
            .map((fehler: { msg?: unknown }) => (typeof fehler?.msg === "string" ? fehler.msg.replace(/^Value error, /, "") : null))
            .filter(Boolean);
        if (meldungen.length) return meldungen.join(" ");
    }
    return standard;
}

export async function anfrage<T>(
    pfad: string,
    methode: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    schema: z.ZodType<T>,
    fehler: string,
    body?: unknown,
): Promise<ApiAntwort<T>> {
    try {
        const response = await apiFetch(`${config.backendUrl}/api/v1${pfad}`, {
            method: methode,
            headers: { "Content-Type": "application/json" },
            body: body === undefined ? undefined : JSON.stringify(body),
            cache: "no-store",
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

export const LoeschenSchema = z.object({ success: z.boolean() });
