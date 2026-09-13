import { z } from "zod";

export const skiServicePreiseSchema = z.object({
  id: z.number().int(),
  Service: z.string(),
  Preis: z.number().int(),
  Bindung: z.boolean().nullable(),
});

export const skiServicePreiseListeSchema = z.array(skiServicePreiseSchema);

export type SkiServicePreise = z.infer<typeof skiServicePreiseSchema>;
export type SkiServicePreiseListe = z.infer<typeof skiServicePreiseListeSchema>;


export const CreateSkiservicePreisSchema = z.object({
  Service: z.string().min(1, "Service name is required"),
  Preis: z.number().min(0, "Price must be a positive number"),
  Bindung: z.boolean().optional(),
});

export type CreateSkiservicePreis = z.infer<typeof CreateSkiservicePreisSchema>;