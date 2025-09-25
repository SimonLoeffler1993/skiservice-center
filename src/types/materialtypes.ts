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
    Preis: z.number().positive('Bitte wählen oder geben Sie einen Preis ein'),
    skinr: z.string(),
    stockbez_ID: z.number(),
    stocklaenge: z.number(),
    schuhnr: z.number().optional(),
    SkiFahrerName: z.string(),
});

export type Material = z.infer<typeof MaterialSchema>;

export const MaterialReadSchema = z.object({
    ID: z.number(),
    skinr: z.string().optional(),
    stockbez_ID: z.number().optional(),
    stocklaenge: z.number().optional(),
    schuhnr: z.number().optional(),
    Preis: z.number(),
    SkiFahrerName: z.string().optional(),
})

export type MaterialRead = z.infer<typeof MaterialReadSchema>;

// Für Skistock
export const SkistockSchema = z.object({
  ID: z.number(),
  Bezeichnung: z.string()
})

// Einzeln
export type Skistock = z.infer<typeof SkistockSchema>;

// Mehrfach
export const SkistockArraySchema = z.array(SkistockSchema);
export type SkistockArray = z.infer<typeof SkistockArraySchema>;


