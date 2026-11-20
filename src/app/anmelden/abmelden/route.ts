// Löscht ungültige Anmelde-Cookies (Gerät abgelaufen oder vom Admin abgemeldet) und geht zur Anmeldung.
// Server Components dürfen keine Cookies löschen, deshalb dieser Route Handler.

import { NextRequest, NextResponse } from "next/server";

import { loescheAlles } from "@/lib/sitzung";

export async function GET(request: NextRequest) {
    await loescheAlles();
    const zurueck = request.nextUrl.searchParams.get("zurueck");
    const ziel = new URL("/anmelden", request.nextUrl.origin);
    if (zurueck && zurueck.startsWith("/") && !zurueck.startsWith("//")) ziel.searchParams.set("zurueck", zurueck);
    return NextResponse.redirect(ziel);
}
