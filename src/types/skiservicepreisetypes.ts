import { z } from "zod";

const skiServicePreiseSchema = z.object({
  id: z.number().int(),
  Service: z.string(),
  Preis: z.number().int(),
  Bindung: z.boolean().nullable(),
});

export const skiServicePreiseListeSchema = z.array(skiServicePreiseSchema);

export type SkiServicePreise = z.infer<typeof skiServicePreiseSchema>;
export type SkiServicePreiseListe = z.infer<typeof skiServicePreiseListeSchema>;
