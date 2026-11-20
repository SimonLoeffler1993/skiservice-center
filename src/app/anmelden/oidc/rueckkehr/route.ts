// Rückkehr von der OIDC-Anmeldung: die API leitet mit ?code= (Einmalcode) bzw. ?fehler= hierher.
// Der Code wird auf dem Server gegen Sitzungen getauscht und in httpOnly-Cookies abgelegt.

import { NextRequest, NextResponse } from "next/server";

import { oidcEinloesen } from "@/lib/anmeldungactions";

function sicheresZiel(zurueck: string | null): string {
    return zurueck && zurueck.startsWith("/") && !zurueck.startsWith("//") && !zurueck.startsWith("/anmelden") ? zurueck : "/";
}

export async function GET(request: NextRequest) {
    const parameter = request.nextUrl.searchParams;
    const zurueck = sicheresZiel(parameter.get("zurueck"));
    const ziel = (pfad: string) => new URL(pfad, request.nextUrl.origin);

    const code = parameter.get("code");
    const fehler = parameter.get("fehler");
    if (fehler || !code) {
        return NextResponse.redirect(ziel(`/anmelden?fehler=${encodeURIComponent(fehler ?? "oidc")}`));
    }
    const antwort = await oidcEinloesen(code, parameter.get("geraet") ?? undefined);
    if (!antwort.success) {
        return NextResponse.redirect(ziel(`/anmelden?fehler=${encodeURIComponent("oidc")}`));
    }
    return NextResponse.redirect(ziel(antwort.data.passwort_aendern ? "/konto?pflicht=1" : zurueck));
}
