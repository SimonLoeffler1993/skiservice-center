// Gemeinsame Helfer der Anmeldeseiten (Browser)

import { useState, useSyncExternalStore } from "react";

const GERAET_SCHLUESSEL = "geraet-name";

/** Nur Pfade innerhalb des Centers als Rücksprung, sonst die Startseite. */
export function sicheresZiel(zurueck: string | null | undefined): string {
    return zurueck && zurueck.startsWith("/") && !zurueck.startsWith("//") && !zurueck.startsWith("/anmelden") ? zurueck : "/";
}

/** Zuletzt verwendeter Gerätename, damit er beim erneuten Anmelden vorgeschlagen wird. */
export function gemerkterGeraetName(): string {
    try {
        return localStorage.getItem(GERAET_SCHLUESSEL) ?? "";
    } catch {
        return "";
    }
}

export function merkeGeraetName(name: string) {
    try {
        if (name.trim()) localStorage.setItem(GERAET_SCHLUESSEL, name.trim());
    } catch {
        // ohne Speicher wird der Name nur nicht vorgeschlagen
    }
}

/** Startet die OIDC-Anmeldung über die API; danach geht es zum Route Handler /anmelden/oidc/rueckkehr. */
export function oidcStartUrl(backendUrl: string, zurueck: string, geraetName?: string): string {
    const ruecksprung = new URL("/anmelden/oidc/rueckkehr", window.location.origin);
    ruecksprung.searchParams.set("zurueck", sicheresZiel(zurueck));
    if (geraetName?.trim()) ruecksprung.searchParams.set("geraet", geraetName.trim());
    return `${backendUrl}/api/v1/auth/oidc/start?ziel=${encodeURIComponent(ruecksprung.toString())}`;
}

const nichtsAbonnieren = () => () => {};

/**
 * Gerätename fürs Formular: vorgeschlagen wird der zuletzt verwendete (localStorage, nur im Browser),
 * sobald getippt wird, gilt die Eingabe.
 */
export function useGeraetName(): [string, (name: string) => void] {
    const gemerkt = useSyncExternalStore(nichtsAbonnieren, gemerkterGeraetName, () => "");
    const [eingabe, setEingabe] = useState<string | null>(null);
    return [eingabe ?? gemerkt, setEingabe];
}
