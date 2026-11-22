// PDFs der API über das Center ausliefern: der Link braucht so keine Anmeldedaten im Browser,
// das Center holt das PDF auf dem Server mit dem Token aus den Cookies.
//   /api/pdf/quittung/<id> → /api/v1/quittungen/quittung/<id>/pdf
//   /api/pdf/verleih/<id>  → /api/v1/saisonverleih/pdf/<id>

import { NextRequest, NextResponse } from "next/server";

import { apiFetch } from "@/lib/apianfrage";
import { config } from "@/lib/config";

const ZIELE: Record<string, (id: string) => string> = {
    quittung: (id) => `/quittungen/quittung/${id}/pdf`,
    verleih: (id) => `/saisonverleih/pdf/${id}`,
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ pfad: string[] }> }) {
    const { pfad } = await params;
    const [art, id] = pfad;
    const ziel = ZIELE[art];
    if (!ziel || pfad.length !== 2 || !/^\d+$/.test(id)) {
        return new NextResponse("Nicht gefunden", { status: 404 });
    }
    const antwort = await apiFetch(`${config.backendUrl}/api/v1${ziel(id)}`, { cache: "no-store" });
    if (antwort.status === 401) {
        return NextResponse.redirect(new URL("/anmelden", _request.nextUrl.origin));
    }
    const kopf = new Headers();
    for (const name of ["content-type", "content-disposition", "content-length"]) {
        const wert = antwort.headers.get(name);
        if (wert) kopf.set(name, wert);
    }
    return new NextResponse(antwort.body, { status: antwort.status, headers: kopf });
}
