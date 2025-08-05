import { z } from "zod";

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

export type SaisonverleihPreis = z.infer<typeof SkiSaisonverleihPreisSchema>;
export type SaisonverleihPreise = z.infer<typeof SaisonverleihPreiseSchema>;
