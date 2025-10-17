import { z } from "zod";

// Skischema
const ArtSchema = z.object({
  Art: z.string(),
  ID: z.number(),
});

export const HerstellerSchema = z.object({
  Name: z.string(),
  ID: z.number(),
});

export const HerstellerCreateSchema = z.object({
  Name: z.string().min(1, "Darf nicht leer sein").max(100, "Darf nicht länger als 100 Zeichen sein"),
});
export type HerstellerCreate = z.infer<typeof HerstellerCreateSchema>;

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

export const SkiHerstellerArraySchema = z.array(HerstellerSchema);
export type SkiHerstellerArray = z.infer<typeof SkiHerstellerArraySchema>;

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


// TODO Ski usw vertiefen
export const MaterialReadSchema = z.object({
  ID: z.number(),
  skinr: z.string().optional().nullable(),
  Ski: SkiSchema.optional().nullable(),
  stockbez_ID: z.number().optional().nullable(),
  stocklaenge: z.number().optional().nullable(),
  Stock: SkistockSchema.optional().nullable(),
  schuhnr: z.number().optional().nullable(),
  Schuh: SchuhSchema.optional().nullable(),
  Preis: z.number(),
  SkiFahrerName: z.string().optional().nullable(),
})

export type MaterialRead = z.infer<typeof MaterialReadSchema>;
