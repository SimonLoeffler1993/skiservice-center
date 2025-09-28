import { z } from "zod";
import { MaterialSchema, MaterialReadSchema } from "./materialtypes";
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
export const SaisonVerleihSchema = z.object({
    ID: z.number().int(),
    Kunde_ID: z.number().int(),
    Ueberweisung: z.number().int().optional().nullable(),
    Bezahlt: z.number().int().optional().nullable(),
    Bezahlt_Am: z.string().date().optional().nullable(), // oder z.date()
    Zurueck: z.boolean().optional().nullable(),
    Zurueck_Am: z.string().date().optional().nullable(),
    Bemerkung: z.string().optional(),
    Saison_ID: z.number().int(), //nur wen es abweicht von der aktuellen Saison
    Abgerechnet: z.number().int().optional().nullable(),
    Name: z.string(),
    Start_Am: z.string().date().optional().nullable(),
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
    QuittungID: z.number().int().optional(),
    Material: z.array(MaterialSchema).optional().nullable(),
});

export type SaisonVerleihCreate = z.infer<typeof SaisonVerleihCreateSchema>;

export const SaisonVerleihCreateResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: SaisonVerleihSchema.optional(),
});

export type SaisonVerleihCreateResponse = z.infer<typeof SaisonVerleihCreateResponseSchema>;

export const SaisonverleihReadSchema = SaisonVerleihSchema.extend({
    Kunde: kundeSchema,
});

export type SaisonverleihRead = z.infer<typeof SaisonverleihReadSchema>;

// Mehrfach für Übersicht
export const SaisonverleihReadListSchema = z.array(SaisonverleihReadSchema);
export type SaisonverleihReadList = z.infer<typeof SaisonverleihReadListSchema>;
