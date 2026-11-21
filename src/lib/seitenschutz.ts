// Für Server Components: Seiten mit einem Recht leiten auf die Startseite, wenn das Recht fehlt.
// Ohne Anmeldung zählen die Rechte der Gruppe "Ohne Anmeldung" (im Übergang alles); die API prüft ohnehin selbst.

import { redirect } from "next/navigation";

import { holeIch, holeStatus } from "./anmeldungactions";

export async function rechtSeite(recht: string) {
    const ich = await holeIch();
    let rechte: string[];
    if (ich.benutzer) {
        rechte = ich.benutzer.rechte;
    } else {
        const status = await holeStatus();
        rechte = status.success ? status.data.ohne_anmeldung.rechte : ["*"];
    }
    if (!rechte.includes("*") && !rechte.includes(recht)) redirect("/");
}
