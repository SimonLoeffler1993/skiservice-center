import { redirect } from "next/navigation";

import AnmeldeFormular from "@/components/anmeldung/AnmeldeFormular";
import AnmeldeRahmen from "@/components/anmeldung/AnmeldeRahmen";
import { holeStatus } from "@/lib/anmeldungactions";
import { leseTokens } from "@/lib/sitzung";
import { fehlerText } from "@/types/anmeldung";

export const dynamic = "force-dynamic";

export default async function AnmeldenSeite({ searchParams }: {
    searchParams: Promise<{ zurueck?: string; fehler?: string }>;
}) {
    const { zurueck, fehler } = await searchParams;
    // Gerät schon angemeldet: nur den Bediener wählen
    if ((await leseTokens()).geraet) redirect(`/anmelden/bediener${zurueck ? `?zurueck=${encodeURIComponent(zurueck)}` : ""}`);
    const status = await holeStatus();
    if (status.success && status.data.einrichtung_noetig) redirect("/einrichtung");

    return (
        <AnmeldeRahmen titel="Skiservice Center" beschreibung="Anmelden, um dieses Gerät zu verwenden">
            <AnmeldeFormular
                status={status.success ? status.data : null}
                zurueck={zurueck}
                fehler={fehler ? fehlerText(fehler) : status.success ? null : status.error}
            />
        </AnmeldeRahmen>
    );
}
