import { z } from 'zod'

export const saisonverleihPreiseSchema = z.object({
  ID: z.number().int(),
  Bezeichnung: z.string().max(50),
  Preis: z.number(),
  vonL: z.number().int().nullable(),
  bisL: z.number().int().nullable(),
  SkiArt_ID: z.number().int().nullable(),
  inaktiv: z.number().int().nullable().transform(v => v ?? 0),
})

export const saisonverleihPreiseListeSchema = z.object({
  preise: z.array(saisonverleihPreiseSchema),
})

export type SaisonverleihPreise = z.infer<typeof saisonverleihPreiseSchema>
export type SaisonverleihPreiseListe = z.infer<typeof saisonverleihPreiseListeSchema>