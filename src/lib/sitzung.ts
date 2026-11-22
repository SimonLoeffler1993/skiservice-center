// Anmelde-Cookies des Centers. Nur auf dem Server verwenden (Server Actions, Route Handler, Server Components).
// Die Tokens selbst kommen nie in den Browser: httpOnly-Cookies, die API bekommt sie als Bearer-Header.
//
// ski_geraet   Gerätesitzung (lange gültig, das Tablet bleibt angemeldet)
// ski_bediener Bedienersitzung (der aktuelle Mitarbeiter, endet beim Abmelden bzw. nach Inaktivität in der API)

import { cookies, headers } from "next/headers";

import { COOKIE_BEDIENER, COOKIE_GERAET } from "./sitzungnamen";

export { COOKIE_BEDIENER, COOKIE_GERAET };

export type Tokens = { geraet?: string; bediener?: string };

export async function leseTokens(): Promise<Tokens> {
    try {
        const speicher = await cookies();
        return {
            geraet: speicher.get(COOKIE_GERAET)?.value || undefined,
            bediener: speicher.get(COOKIE_BEDIENER)?.value || undefined,
        };
    } catch {
        // Außerhalb einer Anfrage (z.B. im unstable_cache) gibt es keine Cookies
        return {};
    }
}

// Im LAN läuft das Center oft über http: ein "secure"-Cookie würde der Browser dort nicht speichern
async function istHttps(): Promise<boolean> {
    const kopf = await headers();
    const proto = kopf.get("x-forwarded-proto")?.split(",")[0]?.trim();
    if (proto) return proto === "https";
    return (kopf.get("origin") ?? kopf.get("referer") ?? "").startsWith("https://");
}

/** Nur in Server Actions und Route Handlern: Server Components dürfen keine Cookies setzen. */
export async function setzeSitzung(geraetToken: string | null | undefined, bedienerToken: string, geraetTage = 180) {
    const speicher = await cookies();
    const secure = await istHttps();
    if (geraetToken) {
        speicher.set(COOKIE_GERAET, geraetToken, {
            httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: geraetTage * 24 * 60 * 60,
        });
    }
    // Ohne maxAge: endet spätestens mit dem Browser, die API beendet sie nach Inaktivität
    speicher.set(COOKIE_BEDIENER, bedienerToken, { httpOnly: true, sameSite: "lax", secure, path: "/" });
}

export async function loescheBediener() {
    try {
        (await cookies()).delete(COOKIE_BEDIENER);
    } catch {
        // In Server Components nicht erlaubt; die API lehnt das Token ohnehin ab
    }
}

export async function loescheAlles() {
    try {
        const speicher = await cookies();
        speicher.delete(COOKIE_BEDIENER);
        speicher.delete(COOKIE_GERAET);
    } catch {
        // siehe oben
    }
}
