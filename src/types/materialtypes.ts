import { z } from "zod";

const ArtSchema = z.object({
  Art: z.string(),
  ID: z.number(),
});

const HerstellerSchema = z.object({
  Name: z.string(),
  ID: z.number(),
});

const ModellSchema = z.object({
  Modell: z.string(),
  Art_ID: z.number(),
  Hersteller_ID: z.number(),
  ID: z.number(),
  Art: ArtSchema,
  Hersteller: HerstellerSchema,
});

export const SkiSchema = z.object({
  Modell_ID: z.number(),
  Laenge: z.number(),
  VK: z.number(),
  EK: z.number(),
  Saison: z.string(),
  SkiNr: z.string(),
  ID: z.number(),
  Modell: ModellSchema,
});

export const SkiArraySchema = z.array(SkiSchema);

export type Art = z.infer<typeof ArtSchema>;
export type Hersteller = z.infer<typeof HerstellerSchema>;
export type Modell = z.infer<typeof ModellSchema>;
export type Ski = z.infer<typeof SkiSchema>;
