// Leitet Seitenaufrufe ohne Anmeldung zur Anmeldung weiter.
// Geprüft wird nur, ob die Cookies da sind; ob sie gültig sind, entscheidet die API bei jedem Aufruf.
//
// - mit Bediener-Cookie: durch
// - nur Geräte-Cookie (Bediener abgemeldet oder abgelaufen): Bedienerauswahl
// - ohne Cookies: Einrichtung (noch kein Benutzer), Anmeldung (Pflicht an) oder durch (Übergang)

import { NextRequest, NextResponse } from "next/server";

import { COOKIE_BEDIENER, COOKIE_GERAET } from "@/lib/sitzungnamen";

type Status = { einrichtung_noetig: boolean; anmeldung_erzwungen: boolean };

// Status der API kurz merken, damit nicht jeder Seitenaufruf ihn abfragt
let statusCache: { zeit: number; status: Status } | null = null;
const STATUS_MS = 30_000;

async function holeStatus(): Promise<Status | null> {
    if (statusCache && Date.now() - statusCache.zeit < STATUS_MS) return statusCache.status;
    try {
        const response = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:8000"}/api/v1/auth/status`, {
            cache: "no-store",
            signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) return null;
        const status = (await response.json()) as Status;
        statusCache = { zeit: Date.now(), status };
        return status;
    } catch {
        // API nicht erreichbar: die Startseite zeigt das selbst an
        return null;
    }
}

function weiterleiten(request: NextRequest, pfad: string) {
    const url = request.nextUrl.clone();
    const zurueck = request.nextUrl.pathname + request.nextUrl.search;
    url.pathname = pfad;
    url.search = zurueck && zurueck !== "/" ? `?zurueck=${encodeURIComponent(zurueck)}` : "";
    return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
    // Server Actions und andere Nicht-Seitenaufrufe nicht umleiten
    if (request.method !== "GET" || request.headers.get("next-action")) return NextResponse.next();

    if (request.cookies.get(COOKIE_BEDIENER)?.value) return NextResponse.next();
    if (request.cookies.get(COOKIE_GERAET)?.value) return weiterleiten(request, "/anmelden/bediener");

    const status = await holeStatus();
    if (status?.einrichtung_noetig) return weiterleiten(request, "/einrichtung");
    if (status?.anmeldung_erzwungen) return weiterleiten(request, "/anmelden");
    return NextResponse.next();
}

export const config = {
    // Nicht für Anmeldung, Einrichtung, Route Handler (prüfen selbst), Next-Dateien und Bilder
    matcher: ["/((?!anmelden|einrichtung|api/|_next/|favicon\\.ico|icon\\.svg|apple-icon\\.png|.*\\.(?:png|jpg|svg|ico|webp)$).*)"],
};
