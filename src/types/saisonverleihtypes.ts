import { z } from "zod";
import { MaterialSchema } from "./materialtypes";

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
  export const SaisonVerleihCreateSchema = z.object({
    Kunde_ID: z.number().int(),
    Ueberweisung: z.number().int().optional(),
    Bezahlt: z.number().int().optional(),
    Bezahlt_Am: z.string().datetime().optional(), // oder z.date()
    Zurueck: z.number().int().optional(),
    Zurueck_Am: z.string().datetime().optional(),
    Bemerkung: z.string().optional(),
    Saison_ID: z.number().int().optional(), //nur wen es abweicht von der aktuellen Saison
    Abgerechnet: z.number().int().optional(),
    // Name: z.string(),
    Start_Am: z.string().datetime().optional(),
    QuittungID: z.number().int().optional(),
    Material: z.array(MaterialSchema),
  });

  export type SaisonVerleihCreate = z.infer<typeof SaisonVerleihCreateSchema>;