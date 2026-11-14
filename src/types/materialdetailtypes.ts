import { z } from "zod";

import { SchuhSchema, SkiSchema } from "./materialtypes";
import { VerleihArtSchema, VerleihStatusSchema } from "./saisonverleihtypes";

// Eine Verleihzeile, in der der Ski bzw. Schuh steckt, mit seinem Anteil am Zeilenpreis
export const MaterialVerleihPositionSchema = z.object({
    Verleih_ID: z.number(),
    Material_ID: z.number(),
    Name: z.string(),
    Art: VerleihArtSchema.catch("saison"),
    Saison_ID: z.number().nullable(),
    Start_Am: z.string().nullish(),
    Ende_Am: z.string().nullish(),
    Kunde: z.string(),
    Fahrer: z.string().nullish(),
    Status: VerleihStatusSchema.catch("unterwegs"),
    Bezahlt: z.boolean(),
    // Preis der ganzen Zeile (Ski, Schuh und Stock zusammen)
    Preis: z.number(),
    MitSki: z.boolean(),
    MitSchuh: z.boolean(),
    AnteilProzent: z.number(),
    Anteil: z.number(),
});
export type MaterialVerleihPosition = z.infer<typeof MaterialVerleihPositionSchema>;

export const ErloesSummenSchema = z.object({
    AnzahlVerleihe: z.number(),
    Einnahmen: z.number(),
    ServiceAbzug: z.number().default(0),
    // Einnahmen abzüglich Services
    Ergebnis: z.number(),
});
export type ErloesSummen = z.infer<typeof ErloesSummenSchema>;

// Service an einem Leihski
export const SkiServiceSchema = z.object({
    ID: z.number(),
    EigenSki_ID: z.number(),
    Datum: z.string(),
    Bezeichnung: z.string(),
    Abzug: z.number(),
});
export type SkiService = z.infer<typeof SkiServiceSchema>;

export type SkiServiceEingabe = {
    Datum: string;
    Bezeichnung: string;
    Abzug: number;
};

export const SkiDetailsSchema = z.object({
    Ski: SkiSchema,
    Verleihe: z.array(MaterialVerleihPositionSchema),
    Services: z.array(SkiServiceSchema),
    Summen: ErloesSummenSchema,
    // Einstellungen: Anteil des Skis bei Ski + Schuh, Vorschlag für den Abzug je Service
    AnteilSkiProzent: z.number(),
    ServiceAbzugStandard: z.number(),
});
export type SkiDetails = z.infer<typeof SkiDetailsSchema>;

export const SchuhDetailsSchema = z.object({
    Schuh: SchuhSchema,
    Verleihe: z.array(MaterialVerleihPositionSchema),
    Summen: ErloesSummenSchema,
    AnteilSkiProzent: z.number(),
});
export type SchuhDetails = z.infer<typeof SchuhDetailsSchema>;
