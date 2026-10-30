"use server";

import { z } from "zod";

import { Kunde, KundeErfassen, kundeSchema, kundenArraySchema, SkiSuchKunde } from "@/types/skikundentypes";
import { ApiAntwort } from "@/types/actiontypes";
import { config } from "./config";
import { anfrage } from "./apianfrage";

export async function kundeSuchen(previousState: unknown,formdata: SkiSuchKunde) {
    try {
        // const vorname = formdata.get("Vorname")?.toString() || "";
        // const nachname = formdata.get("Nachname")?.toString() || "";
        const vorname = formdata.Vorname || "";
        const nachname = formdata.Nachname || "";
        const response = await fetch(`${config.backendUrl}/api/v1/kunden/suchen?vorname=${vorname}&nachname=${nachname}`, { cache: "no-store" });
        if (!response.ok) {
            console.error("Fehler beim Suchen:", response);
            // return "error";
            return { success: false, error: "Fehler beim Suchen", data: null };
        }
        const data = await response.json();
        const parsedData = kundenArraySchema.safeParse(data);
        if (!parsedData.success) {
            console.error("Validierungsfehler:", parsedData.error);
            // return "validation error";
        }
        return parsedData;

    } catch (error) {
        console.error("Fehler beim Suchen:", error);
        // return "error";
        return { success: false, error: "Fehler beim Suchen - " + error, data: null };
    }
}
// Orte zu einer PLZ, z.B. ["Weingarten"]. Wirft bei Fehlern, damit useQuery sie anzeigen kann
export async function getOrte(plz: string): Promise<string[]> {
    if (!/^\d{5}$/.test(plz)) return [];
    const response = await fetch(`${config.backendUrl}/api/v1/orte/getname?plz=${plz}`, { cache: "no-store" });
    if (!response.ok) {
        throw new Error("PLZ konnte nicht geprüft werden");
    }
    const daten: { Ort: string }[] = await response.json();
    return daten.map((eintrag) => eintrag.Ort);
}

const ErfassenAntwortSchema = z.object({ success: z.boolean(), id: z.number().nullish() });

// Formularwerte so, wie die API sie erwartet (leer -> null, PLZ als Zahl)
function zuApiKunde(daten: KundeErfassen) {
    const leerZuNull = (wert: string) => wert.trim() || null;
    return {
        Vorname: leerZuNull(daten.Vorname),
        Nachname: leerZuNull(daten.Nachname),
        Strasse: leerZuNull(daten.Strasse),
        Plz: daten.Plz ? Number(daten.Plz) : null,
        Tel: leerZuNull(daten.Tel),
        Handy: leerZuNull(daten.Handy),
        Email: leerZuNull(daten.Email),
    };
}

// Legt einen neuen Kunden an und gibt ihn vollständig (mit Ort) zurück
export async function kundeErfassen(daten: KundeErfassen): Promise<ApiAntwort<Kunde>> {
    const antwort = await anfrage("/kunden/erfassen", "POST", ErfassenAntwortSchema, "Kunde konnte nicht angelegt werden.", zuApiKunde(daten));
    if (!antwort.success) return antwort;
    if (!antwort.data.success || !antwort.data.id) {
        return { success: false, error: "Kunde konnte nicht angelegt werden." };
    }
    return anfrage(`/kunden/${antwort.data.id}`, "GET", kundeSchema, "Kunde wurde angelegt, konnte aber nicht geladen werden.");
}

// Ändert einen Kunden und gibt ihn neu geladen (mit Ort) zurück
export async function kundeAendern(id: number, daten: KundeErfassen): Promise<ApiAntwort<Kunde>> {
    const antwort = await anfrage(`/kunden/${id}`, "PUT", z.object({ success: z.boolean() }).loose(), "Kunde konnte nicht gespeichert werden.", zuApiKunde(daten));
    if (!antwort.success) return antwort;
    if (!antwort.data.success) return { success: false, error: "Kunde konnte nicht gespeichert werden." };
    return anfrage(`/kunden/${id}`, "GET", kundeSchema, "Kunde wurde gespeichert, konnte aber nicht neu geladen werden.");
}

// Zuletzt angelegte Kunden (z.B. gerade am Kundenterminal erfasst), Anzahl aus den Einstellungen
export async function holeLetzteKunden(): Promise<ApiAntwort<Kunde[]>> {
    return anfrage("/kunden/letzte", "GET", kundenArraySchema, "Letzte Kunden konnten nicht geladen werden.");
}

// Kunde neu laden, z.B. nachdem er seine Daten am Kundenterminal geändert hat
export async function holeKunde(id: number): Promise<ApiAntwort<Kunde>> {
    return anfrage(`/kunden/${id}`, "GET", kundeSchema, "Kunde konnte nicht geladen werden.");
}
