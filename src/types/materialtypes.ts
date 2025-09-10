import { z } from "zod";

// Skischema
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


// Schuhschema
export const SchuhHerstellerSchema = z.object({
  Name: z.string(),
  ID: z.number(),
});

export const SchuhModellSchema = z.object({
  Modell: z.string(),
  Jugend: z.number(),
  Hersteller_ID: z.number(),
  ID: z.number(),
  Hersteller: HerstellerSchema,
});

export const SchuhSchema = z.object({
  Modell_ID: z.number(),
  Groese: z.number(),
  Saison: z.string(),
  VK: z.number(),
  EK: z.number(),
  ID: z.number(),
  Modell: SchuhModellSchema,
});

export type Schuh = z.infer<typeof SchuhSchema>;

// Für MaterialEingabe
export const MaterialSchema = z.object({
    servicePreis: z.string().min(1, 'Bitte wählen Sie eine Service'),
    skiNr: z.string().min(1, 'Ski-Nummer ist erforderlich'),
    stock: z.string().min(1, 'Stock ist erforderlich'),
    interneSchuhNummer: z.string().min(1, 'Schuh-Nummer ist erforderlich'),
    skifahrerName: z.string().min(1, 'Name des Skifahrers ist erforderlich'),
});

export type Material = z.infer<typeof MaterialSchema>;
