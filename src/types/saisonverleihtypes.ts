import { z } from "zod";
import { MaterialNeuSchema, MaterialReadSchema } from "./materialtypes";
import { kundeSchema } from "./skikundentypes";

// --- SaisonVerleihPreis ---
export const SkiSaisonverleihPreisSchema = z.object({
    ID: z.number().int(),
    Bezeichnung: z.string().max(50),
    Preis: z.number(),
    vonL: z.number().int().nullable().optional(),
    bisL: z.number().int().nullable().optional(),
    SkiArt_ID: z.number().int().nullable().optional(),
    inaktiv: z.number().int().default(0),
});

export const SaisonverleihPreiseSchema = z.object({
    preise: z.array(SkiSaisonverleihPreisSchema),
})

// Einzeln
export type SaisonverleihPreis = z.infer<typeof SkiSaisonverleihPreisSchema>;
// Mehrfach
export type SaisonverleihPreise = z.infer<typeof SaisonverleihPreiseSchema>;

// --- SaisonVerleihMaterial ---
// export const SaisonVerleihMaterialCreateSchema = z.object({
//     skinr: z.string().optional(),
//     schuhnr: z.number().int().optional(),
//     stockbez_ID: z.number().int().optional(),
//     stocklaenge: z.number().int().optional(),
//     Preis: z.number(),
//     SkiFahrerName: z.string().optional(),
//   });

//   export type SaisonVerleihMaterialCreate = z.infer<typeof SaisonVerleihMaterialCreateSchema>;

// --- SaisonVerleih ---
// "saison" = Saisonverleih, "tag" = Tagesverleih
export const VerleihArtSchema = z.enum(["saison", "tag"]);
export type VerleihArt = z.infer<typeof VerleihArtSchema>;

export const SaisonVerleihSchema = z.object({
    ID: z.number().int(),
    Kunde_ID: z.number().int(),
    Ueberweisung: z.number().int().optional().nullable(),
    Bezahlt: z.number().int().optional().nullable(),
    Bezahlt_Am: z.string().date().optional().nullable(), // oder z.date()
    Zurueck: z.boolean().optional().nullable(),
    Zurueck_Am: z.string().date().optional().nullable(),
    Bemerkung: z.string().nullish(),
    Saison_ID: z.number().int(), //nur wen es abweicht von der aktuellen Saison
    Abgerechnet: z.number().int().optional().nullable(),
    Name: z.string(),
    Start_Am: z.string().date().optional().nullable(),
    Ende_Am: z.string().date().optional().nullable(),
    Art: VerleihArtSchema.default("saison"),
    Tage: z.number().int().optional().nullable(),
    Bezeichnung: z.string().optional(),
    QuittungID: z.number().int().optional().nullable(),
    Material: z.array(MaterialReadSchema).optional().nullable(),
})

export type SaisonVerleih = z.infer<typeof SaisonVerleihSchema>;

export const SaisonVerleihCreateSchema = z.object({
    Kunde_ID: z.number().int(),
    Ueberweisung: z.number().int().optional(),
    Bezahlt: z.number().int().optional(),
    Bezahlt_Am: z.string().date().optional(), // oder z.date()
    Zurueck: z.boolean().optional(),
    Zurueck_Am: z.string().date().optional(),
    Bemerkung: z.string().optional(),
    Saison_ID: z.number().int().optional(), //nur wen es abweicht von der aktuellen Saison
    Abgerechnet: z.number().int().optional(),
    // Name: z.string(),
    Start_Am: z.string().date().optional(),
    Ende_Am: z.string().date().optional(),
    Art: VerleihArtSchema.optional(),
    QuittungID: z.number().int().optional(),
    Material: z.array(MaterialNeuSchema).optional().nullable(),
});

export type SaisonVerleihCreate = z.infer<typeof SaisonVerleihCreateSchema>;

export const SaisonVerleihCreateResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().nullish(),
    data: SaisonVerleihSchema.nullish(),
});

export type SaisonVerleihCreateResponse = z.infer<typeof SaisonVerleihCreateResponseSchema>;

export const SaisonverleihReadSchema = SaisonVerleihSchema.extend({
    Kunde: kundeSchema,
});

export type SaisonverleihRead = z.infer<typeof SaisonverleihReadSchema>;

// Mehrfach für Übersicht
export const SaisonverleihReadListSchema = z.array(SaisonverleihReadSchema);
export type SaisonverleihReadList = z.infer<typeof SaisonverleihReadListSchema>;

// Namen Ettiket Response
export const SaisonVerleihNamenEttiketResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
});
export type SaisonVerleihNamenEttiketResponse = z.infer<typeof SaisonVerleihNamenEttiketResponseSchema>;


// --- Belegung (Prüfung beim Tagesverleih) ---
export const VerleihBelegungSchema = z.object({
    ID: z.number().int(),
    Name: z.string(),
    Art: VerleihArtSchema,
    Start_Am: z.string().date().nullable().optional(),
    Ende_Am: z.string().date().nullable().optional(),
    Kunde: z.string(),
    Material: z.enum(["Ski", "Schuh"]),
});
export const VerleihBelegungListeSchema = z.array(VerleihBelegungSchema);
export type VerleihBelegung = z.infer<typeof VerleihBelegungSchema>;
