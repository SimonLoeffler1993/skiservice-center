"use server";

import { z } from "zod";

import { apiFetch } from "@/lib/apianfrage";
import { config } from "@/lib/config";
import { automatischerGeraetName } from "@/lib/geraetname";
import { leseTokens, loescheAlles, loescheBediener, setzeSitzung } from "@/lib/sitzung";
import { ApiAntwort } from "@/types/actiontypes";
import {
    AnmeldeAntwortSchema, AuthStatus, AuthStatusSchema, fehlerText, Ich, IchBenutzer, IchBenutzerSchema, IchGeraet,
    IchGeraetSchema, IchSchema, Kachel, KachelSchema,
} from "@/types/anmeldung";

const API = () => `${config.backendUrl}/api/v1/auth`;

async function fehlerAus(response: Response, standard: string): Promise<string> {
    const daten = await response.json().catch(() => null);
    const detail = typeof daten?.detail === "string" ? daten.detail : null;
    if (!detail) return standard;
    // Texte der API (z.B. Passwortregeln) sind schon deutsch, Codes werden übersetzt
    return /^[a-z_]+$/.test(detail) ? fehlerText(detail, response.headers.get("X-Gesperrt-Bis")) : detail;
}

function nichtErreichbar<T>(error: unknown): ApiAntwort<T> {
    console.error("Anmeldung: API nicht erreichbar", error);
    return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
}

/** Header nur mit dem Geräte-Token: ein abgelaufenes Bediener-Token würde die Anmeldung sonst ablehnen. */
async function geraetKopf(): Promise<Record<string, string>> {
    const { geraet } = await leseTokens();
    return geraet ? { Authorization: `Bearer ${geraet}` } : {};
}

async function sitzungUebernehmen(response: Response): Promise<ApiAntwort<IchBenutzer>> {
    const daten = AnmeldeAntwortSchema.safeParse(await response.json());
    if (!daten.success) return { success: false, error: "Ungültige Antwort vom Server." };
    await setzeSitzung(daten.data.geraet_token, daten.data.bediener_token);
    return { success: true, data: daten.data.benutzer };
}

export async function holeStatus(): Promise<ApiAntwort<AuthStatus>> {
    try {
        const response = await fetch(`${API()}/status`, { cache: "no-store" });
        if (!response.ok) return { success: false, error: "Status nicht abrufbar." };
        const daten = AuthStatusSchema.safeParse(await response.json());
        return daten.success ? { success: true, data: daten.data } : { success: false, error: "Ungültige Antwort vom Server." };
    } catch (error) {
        return nichtErreichbar(error);
    }
}

/** Aktueller Bediener und Gerät. Ohne Anmeldung beides null. */
export async function holeIch(): Promise<Ich> {
    const leer: Ich = { benutzer: null, geraet: null, methode: null };
    const tokens = await leseTokens();
    if (!tokens.bediener && !tokens.geraet) return leer;
    try {
        let response = await apiFetch(`${API()}/ich`, { cache: "no-store" });
        if (response.status === 401 && tokens.bediener && tokens.geraet) {
            // Bediener abgelaufen: das Gerät kann noch angemeldet sein
            response = await fetch(`${API()}/ich`, { cache: "no-store", headers: { Authorization: `Bearer ${tokens.geraet}` } });
        }
        if (!response.ok) return leer;
        const daten = IchSchema.safeParse(await response.json());
        return daten.success ? daten.data : leer;
    } catch {
        return leer;
    }
}

export async function anmelden(benutzername: string, passwort: string): Promise<ApiAntwort<IchBenutzer>> {
    return passwortAnmeldung(benutzername, passwort, true);
}

async function passwortAnmeldung(benutzername: string, passwort: string, mitGeraet: boolean): Promise<ApiAntwort<IchBenutzer>> {
    try {
        const response = await fetch(`${API()}/anmelden`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(mitGeraet ? await geraetKopf() : {}) },
            body: JSON.stringify({ benutzername, passwort, geraet_name: await automatischerGeraetName(), geraet_art: "center" }),
            cache: "no-store",
        });
        if (mitGeraet && response.status === 401 && (await response.clone().json().catch(() => null))?.detail === "anmeldung_noetig") {
            // Gerätesitzung ungültig (z.B. vom Admin abgemeldet): als neues Gerät anmelden
            await loescheAlles();
            return passwortAnmeldung(benutzername, passwort, false);
        }
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Anmeldung fehlgeschlagen.") };
        return sitzungUebernehmen(response);
    } catch (error) {
        return nichtErreichbar(error);
    }
}

export async function einrichten(daten: { benutzername: string; anzeigename: string; passwort: string; email?: string }): Promise<ApiAntwort<IchBenutzer>> {
    try {
        const response = await fetch(`${API()}/einrichtung`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                benutzername: daten.benutzername, anzeigename: daten.anzeigename, passwort: daten.passwort,
                email: daten.email || null, geraet_name: await automatischerGeraetName(), geraet_art: "center",
            }),
            cache: "no-store",
        });
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Einrichtung fehlgeschlagen.") };
        return sitzungUebernehmen(response);
    } catch (error) {
        return nichtErreichbar(error);
    }
}

export async function holeKacheln(): Promise<ApiAntwort<Kachel[]>> {
    try {
        const kopf = await geraetKopf();
        if (!kopf.Authorization) return { success: true, data: [] };
        const response = await fetch(`${API()}/kacheln`, { headers: kopf, cache: "no-store" });
        if (response.status === 401) return { success: false, error: "anmeldung_noetig" };
        if (!response.ok) return { success: false, error: "Bediener konnten nicht geladen werden." };
        const daten = z.array(KachelSchema).safeParse(await response.json());
        return daten.success ? { success: true, data: daten.data } : { success: false, error: "Ungültige Antwort vom Server." };
    } catch (error) {
        return nichtErreichbar(error);
    }
}

export async function pinAnmelden(benutzerId: number, pin: string): Promise<ApiAntwort<IchBenutzer>> {
    try {
        const response = await fetch(`${API()}/pin`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(await geraetKopf()) },
            body: JSON.stringify({ benutzer_id: benutzerId, pin }),
            cache: "no-store",
        });
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Anmeldung fehlgeschlagen.") };
        return sitzungUebernehmen(response);
    } catch (error) {
        return nichtErreichbar(error);
    }
}

/** Tauscht den Einmalcode aus der OIDC-Rückleitung gegen Sitzungen (aus dem Route Handler). */
export async function oidcEinloesen(code: string): Promise<ApiAntwort<IchBenutzer>> {
    try {
        const response = await fetch(`${API()}/oidc/einloesen`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(await geraetKopf()) },
            body: JSON.stringify({ code, geraet_name: await automatischerGeraetName(), geraet_art: "center" }),
            cache: "no-store",
        });
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Anmeldung fehlgeschlagen.") };
        return sitzungUebernehmen(response);
    } catch (error) {
        return nichtErreichbar(error);
    }
}

/**
 * Bediener abmelden. Ein dauerhaft angemeldetes Gerät bleibt angemeldet (Bedienerauswahl); eine persönliche
 * Anmeldung endet ganz. Gibt true zurück, wenn damit auch das Gerät abgemeldet ist (dann zu /anmelden).
 */
export async function bedienerAbmelden(): Promise<boolean> {
    let geraetWeg = false;
    try {
        const response = await apiFetch(`${API()}/bediener/abmelden`, { method: "POST", cache: "no-store" });
        geraetWeg = response.ok ? Boolean((await response.json())?.geraet_abgemeldet) : response.status === 401;
    } catch (error) {
        console.error("Bediener abmelden", error);
    }
    if (geraetWeg) await loescheAlles();
    else await loescheBediener();
    return geraetWeg;
}

/** Macht dieses Gerät dauerhaft angemeldet (Recht „Gerät anmelden“, Passwort erneut). */
export async function geraetDauerhaftAnmelden(passwort: string, name: string): Promise<ApiAntwort<IchGeraet>> {
    try {
        const response = await apiFetch(`${API()}/geraet/anmelden`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passwort, name: name.trim() || null }),
            cache: "no-store",
        });
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Gerät konnte nicht angemeldet werden.") };
        const daten = IchGeraetSchema.safeParse(await response.json());
        return daten.success ? { success: true, data: daten.data } : { success: false, error: "Ungültige Antwort vom Server." };
    } catch (error) {
        return nichtErreichbar(error);
    }
}

/** Wie geraetDauerhaftAnmelden, bestätigt über den OIDC-Anbieter: URL dorthin, zurück auf ziel. */
export async function geraetOidcUrl(ziel: string, name: string): Promise<ApiAntwort<string>> {
    try {
        const response = await apiFetch(`${API()}/geraet/oidc`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ziel, name: name.trim() || null }),
            cache: "no-store",
        });
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Bestätigung nicht möglich.") };
        return { success: true, data: (await response.json()).url };
    } catch (error) {
        return nichtErreichbar(error);
    }
}

/** Das ganze Gerät abmelden. */
export async function geraetAbmelden(): Promise<void> {
    try {
        const kopf = await geraetKopf();
        if (kopf.Authorization) await fetch(`${API()}/abmelden`, { method: "POST", headers: kopf, cache: "no-store" });
    } catch (error) {
        console.error("Gerät abmelden", error);
    }
    await loescheAlles();
}

/** Ticket für Zugriffe ohne Header aus dem Browser (WebSocket). Ohne Anmeldung null. */
export async function holeTicket(pfad: string): Promise<string | null> {
    const tokens = await leseTokens();
    if (!tokens.bediener) return null;
    try {
        const response = await apiFetch(`${API()}/ticket`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pfad }),
            cache: "no-store",
        });
        if (!response.ok) return null;
        return (await response.json())?.ticket ?? null;
    } catch {
        return null;
    }
}

async function kontoAnfrage(pfad: string, methode: "PUT" | "DELETE", body?: unknown): Promise<ApiAntwort<IchBenutzer>> {
    try {
        const response = await apiFetch(`${API()}${pfad}`, {
            method: methode,
            headers: { "Content-Type": "application/json" },
            body: body === undefined ? undefined : JSON.stringify(body),
            cache: "no-store",
        });
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Speichern fehlgeschlagen.") };
        const daten = IchBenutzerSchema.safeParse(await response.json());
        return daten.success ? { success: true, data: daten.data } : { success: false, error: "Ungültige Antwort vom Server." };
    } catch (error) {
        return nichtErreichbar(error);
    }
}

export async function passwortAendern(alt: string | null, neu: string): Promise<ApiAntwort<IchBenutzer>> {
    return kontoAnfrage("/ich/passwort", "PUT", { alt, neu });
}

export async function pinSetzen(passwort: string | null, pin: string): Promise<ApiAntwort<IchBenutzer>> {
    return kontoAnfrage("/ich/pin", "PUT", { passwort, pin });
}

export async function pinLoeschen(): Promise<ApiAntwort<IchBenutzer>> {
    return kontoAnfrage("/ich/pin", "DELETE");
}

export async function oidcTrennen(): Promise<ApiAntwort<IchBenutzer>> {
    return kontoAnfrage("/ich/oidc", "DELETE");
}

/** URL zum Anbieter, um das eigene Konto zu verknüpfen. ziel = Seite, auf die es danach zurückgeht. */
export async function oidcVerknuepfenUrl(ziel: string): Promise<ApiAntwort<string>> {
    try {
        const response = await apiFetch(`${API()}/ich/oidc/verknuepfen`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ziel }),
            cache: "no-store",
        });
        if (!response.ok) return { success: false, error: await fehlerAus(response, "Verknüpfen nicht möglich.") };
        return { success: true, data: (await response.json()).url };
    } catch (error) {
        return nichtErreichbar(error);
    }
}
