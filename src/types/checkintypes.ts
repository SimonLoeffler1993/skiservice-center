import { z } from "zod";

import { kundeSchema } from "./skikundentypes";

export const CheckinKundeSchema = z.object({
    Vorname: z.string().nullish(),
    Nachname: z.string().nullish(),
    Strasse: z.string().nullish(),
    Plz: z.string().nullish(),
    Ort: z.string().nullish(),
    Tel: z.string().nullish(),
    Handy: z.string().nullish(),
    Email: z.string().nullish(),
});

export const CheckinSchema = z.object({
    id: z.string(),
    erstellt_am: z.string(),
    lesbar: z.boolean(),
    // Warum der Datensatz nicht lesbar ist
    grund: z.string().nullish(),
    kunde: CheckinKundeSchema.nullish(),
});

export const CheckinListeSchema = z.array(CheckinSchema);

export const CheckinUebernommenSchema = z.object({
    kunde: kundeSchema,
    // Z.B. unbekannte PLZ, der Kunde ist trotzdem angelegt
    warnung: z.string().nullish(),
});

export const CheckinStatusSchema = z.object({
    eingerichtet: z.boolean(),
    erreichbar: z.boolean(),
    offen: z.number(),
    ohne_schluessel: z.number(),
    // Die Check-in-App bekommt den Public Key über das gemeinsame Volume
    public_key_automatisch: z.boolean().default(false),
    public_key_bereitgestellt: z.boolean().default(false),
});

export const CheckinSchluesselSchema = z.object({
    schluessel_id: z.string(),
    public_key: z.string(),
    erstellt_am: z.string(),
});

export const CheckinSchluesselListeSchema = z.array(CheckinSchluesselSchema);

export type Checkin = z.infer<typeof CheckinSchema>;
export type CheckinUebernommen = z.infer<typeof CheckinUebernommenSchema>;
export type CheckinStatus = z.infer<typeof CheckinStatusSchema>;
export type CheckinSchluessel = z.infer<typeof CheckinSchluesselSchema>;
