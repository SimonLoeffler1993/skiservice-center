import { z } from "zod";

// Werte wie sie die API erwartet und liefert, alles optional
export const BindungsdatenSchema = z.object({
    Fahrer: z.string().max(100).nullable(),
    // Sohlenlänge in mm
    Sohle: z.number().int().min(150).max(400).nullable(),
    // Gewicht in kg
    Gewicht: z.number().min(10).max(200).nullable(),
    // Größe in cm (1,80 m = 180)
    Groesse: z.number().int().min(80).max(230).nullable(),
    // Typ 1 (vorsichtig) bis 3 (sportlich)
    Fahrkoennen: z.number().int().min(1).max(3).nullable(),
    Alter: z.number().int().min(2).max(100).nullable(),
});
export type Bindungsdaten = z.infer<typeof BindungsdatenSchema>;

export const BindungsdatenReadSchema = BindungsdatenSchema.extend({
    ID: z.number().int(),
    Kunde_ID: z.number().int(),
    Ski_ID: z.number().int().nullable(),
    Erfasst_Am: z.iso.date(),
    Archiviert: z.boolean(),
});
export type BindungsdatenRead = z.infer<typeof BindungsdatenReadSchema>;

export const BindungsdatenListeEintragSchema = BindungsdatenReadSchema.extend({
    Auftrag_ID: z.number().int().nullable(),
    Auftrag_Name: z.string().nullable(),
    Ski_Name: z.string().nullable(),
    Service: z.string().nullable(),
});
export type BindungsdatenListeEintrag = z.infer<typeof BindungsdatenListeEintragSchema>;
export const BindungsdatenListeSchema = z.array(BindungsdatenListeEintragSchema);

// Formularwerte: Texte, damit leere Felder und Dezimalkomma möglich sind
export type BindungsdatenEingabe = {
    Fahrer: string;
    Sohle: string;
    Gewicht: string;
    Groesse: string;
    Fahrkoennen: string;
    Alter: string;
    // Aus "Letzte Daten abfragen" übernommener Eintrag, wird beim Speichern archiviert
    vorlage_id?: number;
};

export const LEERE_BINDUNGSDATEN: BindungsdatenEingabe = {
    Fahrer: "", Sohle: "", Gewicht: "", Groesse: "", Fahrkoennen: "", Alter: "",
};

export const FAHRKOENNEN_TEXT: Record<number, string> = {
    1: "Typ 1 – vorsichtig",
    2: "Typ 2 – normal",
    3: "Typ 3 – sportlich",
};

function zahl(text: string): number | null {
    const bereinigt = text.trim().replace(",", ".");
    if (bereinigt === "") return null;
    const wert = Number(bereinigt);
    return Number.isFinite(wert) ? wert : NaN;
}

/**
 * Größe aus der Eingabe in cm umrechnen. Erlaubt sind:
 * - Meter: "1,80" / "1.8" / "2" (Werte unter 10)
 * - Zentimeter: "180" (Werte von 10 bis unter 300), Nachkommastellen werden gerundet
 * - Millimeter: "1800" (Werte ab 300)
 * Leer = null, nicht lesbar = NaN.
 */
export function groesseZuCm(text: string): number | null {
    const wert = zahl(text);
    if (wert === null || Number.isNaN(wert)) return wert;
    if (wert < 10) return Math.round(wert * 100);
    if (wert < 300) return Math.round(wert);
    return Math.round(wert / 10);
}

/** cm als Meter, z.B. 180 -> "1,80" */
export function cmZuMeterText(cm: number): string {
    return (cm / 100).toFixed(2).replace(".", ",");
}

const GRENZEN: { feld: keyof Omit<Bindungsdaten, "Fahrer" | "Groesse">; name: string; min: number; max: number; ganz: boolean }[] = [
    { feld: "Sohle", name: "Sohlenlänge (mm)", min: 150, max: 400, ganz: true },
    { feld: "Gewicht", name: "Gewicht (kg)", min: 10, max: 200, ganz: false },
    { feld: "Fahrkoennen", name: "Fahrkönnen", min: 1, max: 3, ganz: true },
    { feld: "Alter", name: "Alter", min: 2, max: 100, ganz: true },
];

/**
 * Wandelt die Formularwerte in API-Werte um.
 * Gibt eine Fehlermeldung zurück, wenn ein Wert ungültig ist.
 */
export function zuBindungsdaten(eingabe: BindungsdatenEingabe | undefined): { daten: Bindungsdaten | null; fehler: string | null } {
    if (!eingabe) return { daten: null, fehler: null };
    const daten: Bindungsdaten = {
        Fahrer: eingabe.Fahrer.trim() || null,
        Sohle: null, Gewicht: null, Groesse: null, Fahrkoennen: null, Alter: null,
    };
    for (const { feld, name, min, max, ganz } of GRENZEN) {
        const wert = zahl(eingabe[feld]);
        if (wert === null) continue;
        if (Number.isNaN(wert) || wert < min || wert > max || (ganz && !Number.isInteger(wert))) {
            return { daten: null, fehler: `${name} muss ${ganz ? "eine ganze Zahl " : ""}zwischen ${String(min).replace(".", ",")} und ${String(max).replace(".", ",")} sein.` };
        }
        daten[feld] = wert;
    }
    // Größe wird in cm gespeichert
    const groesse = groesseZuCm(eingabe.Groesse);
    if (groesse !== null) {
        if (Number.isNaN(groesse) || groesse < 80 || groesse > 230) {
            return { daten: null, fehler: "Größe muss zwischen 0,80 m und 2,30 m liegen, z.B. 1,80 oder 180." };
        }
        daten.Groesse = groesse;
    }
    const leer = Object.values(daten).every((wert) => wert === null);
    return { daten: leer ? null : daten, fehler: null };
}

/** Formularwerte aus gespeicherten Daten, z.B. zum Bearbeiten oder Übernehmen */
export function zuEingabe(daten: Bindungsdaten | null | undefined): BindungsdatenEingabe {
    if (!daten) return { ...LEERE_BINDUNGSDATEN };
    const text = (wert: number | null) => (wert === null ? "" : String(wert).replace(".", ","));
    return {
        Fahrer: daten.Fahrer ?? "",
        Sohle: text(daten.Sohle),
        Gewicht: text(daten.Gewicht),
        Groesse: daten.Groesse === null ? "" : cmZuMeterText(daten.Groesse),
        Fahrkoennen: text(daten.Fahrkoennen),
        Alter: text(daten.Alter),
    };
}

/** Kurze Zeile wie auf dem Etikett, z.B. "Lena · 305mm · 75kg · 1,80m · Typ 2 · 34J" */
export function bindungsdatenText(daten: Bindungsdaten | null | undefined): string | null {
    if (!daten) return null;
    const teile: string[] = [];
    if (daten.Fahrer) teile.push(daten.Fahrer);
    if (daten.Sohle !== null) teile.push(`${daten.Sohle}mm`);
    if (daten.Gewicht !== null) teile.push(`${String(daten.Gewicht).replace(".", ",")}kg`);
    if (daten.Groesse !== null) teile.push(`${cmZuMeterText(daten.Groesse)}m`);
    if (daten.Fahrkoennen !== null) teile.push(`Typ ${daten.Fahrkoennen}`);
    if (daten.Alter !== null) teile.push(`${daten.Alter}J`);
    return teile.length ? teile.join(" · ") : null;
}
