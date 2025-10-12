import { z } from "zod";

export const SaisonsNamenSchema = z.object({
  Name: z.string(),
  ID: z.number().int(),
  Verwendet: z.number().int(),
});



// Einzel
export type SaisonsNamen = z.infer<typeof SaisonsNamenSchema>;

// Mehrfach
export const SaisonsNamenListeSchema = z.array(SaisonsNamenSchema);
export type SaisonsNamenListe = z.infer<typeof SaisonsNamenListeSchema>;