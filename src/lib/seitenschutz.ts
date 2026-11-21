// Für Server Components: Seiten mit einem Recht leiten Benutzer ohne dieses Recht auf die Startseite.
// Ohne Anmeldung (Übergang) bleiben sie wie bisher erreichbar; die API prüft jede Aktion ohnehin selbst.

import { redirect } from "next/navigation";

import { holeIch } from "./anmeldungactions";

export async function rechtSeite(recht: string) {
    const ich = await holeIch();
    if (ich.benutzer && !ich.benutzer.rechte.includes("*") && !ich.benutzer.rechte.includes(recht)) redirect("/");
}
