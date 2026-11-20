// Für Server Components: Admin-Seiten leiten Mitarbeiter auf die Startseite.
// Ohne Anmeldung (Übergang) bleiben sie wie bisher erreichbar; die API prüft jede Aktion ohnehin selbst.

import { redirect } from "next/navigation";

import { holeIch } from "./anmeldungactions";

export async function nurAdminSeite() {
    const ich = await holeIch();
    if (ich.benutzer && ich.benutzer.rolle !== "admin") redirect("/");
}
