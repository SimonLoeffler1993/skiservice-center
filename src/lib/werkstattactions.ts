"use server";

import { ApiAntwort } from "@/types/actiontypes";
import { WerkstattUebersicht, WerkstattUebersichtSchema } from "@/types/werkstatttypes";
import { anfrage } from "./apianfrage";

// Werkstatt-Dashboard der aktuellen Saison
export async function holeWerkstattUebersicht(): Promise<ApiAntwort<WerkstattUebersicht>> {
    return anfrage("/werkstatt/uebersicht", "GET", WerkstattUebersichtSchema, "Werkstatt-Übersicht konnte nicht geladen werden.");
}
