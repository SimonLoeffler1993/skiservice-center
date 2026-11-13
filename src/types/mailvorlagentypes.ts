import { z } from "zod";

export const PlatzhalterSchema = z.object({
    schluessel: z.string(),
    bezeichnung: z.string(),
    beispiel: z.string(),
});
export type Platzhalter = z.infer<typeof PlatzhalterSchema>;

export const BausteinSchema = z.object({
    schluessel: z.string(),
    bezeichnung: z.string(),
    beschreibung: z.string(),
});
export type Baustein = z.infer<typeof BausteinSchema>;

export const MailVorlageSchema = z.object({
    schluessel: z.string(),
    bezeichnung: z.string(),
    beschreibung: z.string(),
    // Text, Platzhalter als {{name}}
    betreff: z.string(),
    // HTML aus dem Editor, Platzhalter als <span data-platzhalter>, Bausteine als <div data-baustein>
    inhalt: z.string(),
    // Unveränderlicher Originaltext, darauf wird zurückgesetzt
    original_betreff: z.string(),
    original_inhalt: z.string(),
    geaendert: z.boolean(),
    geaendert_am: z.string().nullable(),
    platzhalter: z.array(PlatzhalterSchema),
    bausteine: z.array(BausteinSchema),
});
export type MailVorlage = z.infer<typeof MailVorlageSchema>;

export const MailVorlagenListeSchema = z.array(MailVorlageSchema);

export type MailVorlageDaten = {
    betreff: string;
    inhalt: string;
};

export const MailVorschauSchema = z.object({
    betreff: z.string(),
    html: z.string(),
});
export type MailVorschau = z.infer<typeof MailVorschauSchema>;
