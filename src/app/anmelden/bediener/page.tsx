import { redirect } from "next/navigation";

import AnmeldeRahmen from "@/components/anmeldung/AnmeldeRahmen";
import BedienerAuswahl from "@/components/anmeldung/BedienerAuswahl";
import { holeIch, holeKacheln, holeStatus } from "@/lib/anmeldungactions";
import { leseTokens } from "@/lib/sitzung";
import { fehlerText } from "@/types/anmeldung";

export const dynamic = "force-dynamic";

export default async function BedienerSeite({ searchParams }: {
    searchParams: Promise<{ zurueck?: string; fehler?: string }>;
}) {
    const { zurueck, fehler } = await searchParams;
    if (!(await leseTokens()).geraet) redirect("/anmelden");
    const [status, kacheln, ich] = await Promise.all([holeStatus(), holeKacheln(), holeIch()]);
    // Gerätesitzung ungültig (abgelaufen oder vom Admin abgemeldet)
    if (!kacheln.success && kacheln.error === "anmeldung_noetig") {
        redirect(`/anmelden/abmelden${zurueck ? `?zurueck=${encodeURIComponent(zurueck)}` : ""}`);
    }

    return (
        <AnmeldeRahmen titel="Wer arbeitet gerade?" beschreibung="Mit Benutzername und Passwort anmelden oder die eigene Kachel wählen">
            <BedienerAuswahl
                status={status.success ? status.data : null}
                kacheln={kacheln.success ? kacheln.data : []}
                geraetName={ich.geraet?.name ?? null}
                zurueck={zurueck}
                fehler={fehler ? fehlerText(fehler) : null}
            />
        </AnmeldeRahmen>
    );
}
