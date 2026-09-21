import { z } from 'zod'

export const CreateSaisonverleihPreisSchema = z.object({
  Bezeichnung: z.string().max(50),
  Preis: z.number(),
  vonL: z.number().int().nullable(),
  bisL: z.number().int().nullable(),
  SkiArt_ID: z.number().int().nullable(),
  inaktiv: z.boolean(),
})

export const saisonverleihPreiseSchema = CreateSaisonverleihPreisSchema.extend({
  ID: z.number().int(),
})

export const saisonverleihPreiseListeSchema = z.object({
  preise: z.array(saisonverleihPreiseSchema),
})

export type CreateSaisonverleihPreis = z.infer<typeof CreateSaisonverleihPreisSchema>
export type SaisonverleihPreise = z.infer<typeof saisonverleihPreiseSchema>
export type SaisonverleihPreiseListe = z.infer<typeof saisonverleihPreiseListeSchema>