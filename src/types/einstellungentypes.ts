import { z } from "zod";

export const EinstellungTypSchema = z.enum(["text", "zahl", "bool", "auswahl", "passwort"]);

export const EinstellungSchema = z.object({
    schluessel: z.string(),
    gruppe: z.string(),
    gruppe_bezeichnung: z.string(),
    bezeichnung: z.string(),
    beschreibung: z.string(),
    typ: EinstellungTypSchema,
    optionen: z.array(z.string()),
    // Bei Passwörtern immer null
    wert: z.union([z.string(), z.number(), z.boolean(), z.null()]),
    gesetzt: z.boolean(),
});
export type Einstellung = z.infer<typeof EinstellungSchema>;

export const EinstellungenListeSchema = z.array(EinstellungSchema);
export type EinstellungenListe = z.infer<typeof EinstellungenListeSchema>;

// Formularwerte: Schlüssel -> Wert
export type EinstellungenWerte = Record<string, string | number | boolean | null>;

export const TestErgebnisSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type TestErgebnis = z.infer<typeof TestErgebnisSchema>;
