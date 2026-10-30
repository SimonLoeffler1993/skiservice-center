import { z } from "zod";

export const HandwareSchema = z.object({
    ID: z.number().int(),
    Name: z.string(),
    Beschreibung: z.string().nullish(),
    Kategorie: z.string().nullish(),
    // Nur zur Orientierung, wird beim Verkauf in der Kasse abgezogen
    Anzahl: z.number().int().nullish(),
    Preis: z.number(),
});

export const HandwareListeSchema = z.array(HandwareSchema);

export type Handware = z.infer<typeof HandwareSchema>;

// So wie es an die API geht, nur Name und Preis sind Pflicht
export type HandwareDaten = {
    Name: string;
    Beschreibung: string | null;
    Kategorie: string | null;
    Anzahl: number | null;
    Preis: number;
};
