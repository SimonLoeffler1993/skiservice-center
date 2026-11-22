// Gemeinsame Helfer der Anmeldeseiten (Browser)

/** Nur Pfade innerhalb des Centers als Rücksprung, sonst die Startseite. */
export function sicheresZiel(zurueck: string | null | undefined): string {
    return zurueck && zurueck.startsWith("/") && !zurueck.startsWith("//") && !zurueck.startsWith("/anmelden") ? zurueck : "/";
}

/** Startet die OIDC-Anmeldung über die API; danach geht es zum Route Handler /anmelden/oidc/rueckkehr. */
export function oidcStartUrl(backendUrl: string, zurueck: string): string {
    const ruecksprung = new URL("/anmelden/oidc/rueckkehr", window.location.origin);
    ruecksprung.searchParams.set("zurueck", sicheresZiel(zurueck));
    return `${backendUrl}/api/v1/auth/oidc/start?ziel=${encodeURIComponent(ruecksprung.toString())}`;
}
