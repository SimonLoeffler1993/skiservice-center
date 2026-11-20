import { redirect } from "next/navigation";

import AnmeldeRahmen from "@/components/anmeldung/AnmeldeRahmen";
import EinrichtungFormular from "@/components/anmeldung/EinrichtungFormular";
import { holeStatus } from "@/lib/anmeldungactions";

export const dynamic = "force-dynamic";

export default async function EinrichtungSeite() {
    const status = await holeStatus();
    if (status.success && !status.data.einrichtung_noetig) redirect("/anmelden");

    return (
        <AnmeldeRahmen
            titel="Benutzerverwaltung einrichten"
            beschreibung="Lege den ersten Admin an. Danach können unter Verwalten → Benutzer weitere Mitarbeiter angelegt werden."
        >
            <EinrichtungFormular />
        </AnmeldeRahmen>
    );
}
