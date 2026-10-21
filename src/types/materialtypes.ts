import { z } from "zod";

// Skischema
export const ArtSchema = z.object({
  Art: z.string(),
  ID: z.number(),
});
export type Art = z.infer<typeof ArtSchema>;
// Mehrzahlschema
export const SkiArtArraySchema = z.array(ArtSchema);
export type SkiArtArray = z.infer<typeof SkiArtArraySchema>;


// Hersteller Schema
export const HerstellerSchema = z.object({
  Name: z.string(),
  ID: z.number(),
});
export type Hersteller = z.infer<typeof HerstellerSchema>;

export const HerstellerCreateSchema = z.object({
  Name: z.string().min(1, "Darf nicht leer sein").max(100, "Darf nicht länger als 100 Zeichen sein"),
});
export type HerstellerCreate = z.infer<typeof HerstellerCreateSchema>;

export const SkiHerstellerArraySchema = z.array(HerstellerSchema);
export type SkiHerstellerArray = z.infer<typeof SkiHerstellerArraySchema>;

// Modell Schema
export const SkiModellCreateSchema = z.object({
  Modell: z.string().min(1, "Darf nicht leer sein").max(100, "Darf nicht länger als 100 Zeichen sein"),
  Art_ID: z.number().min(1, "Darf nicht leer sein").max(100, "Darf nicht länger als 100 Zeichen sein"),
  Hersteller_ID: z.number().min(1, "Darf nicht leer sein").max(100, "Darf nicht länger als 100 Zeichen sein"),
});
export type SkiModellCreate = z.infer<typeof SkiModellCreateSchema>;

export const ModellSchema = z.object({
  Modell: z.string(),
  Art_ID: z.number(),
  Hersteller_ID: z.number(),
  ID: z.number(),
  Art: ArtSchema,
  Hersteller: HerstellerSchema,
});

export type Modell = z.infer<typeof ModellSchema>;

export const ModellArraySchema = z.array(ModellSchema);
export type ModellArray = z.infer<typeof ModellArraySchema>;

// Ski Schema
export const SkiCreateSchema = z.object({
  Modell_ID: z.number(),
  Laenge: z.number().min(1, "Darf nicht leer sein").max(250, "Maximal 250cm"),
  VK: z.number(),
  EK: z.number(),
  Saison: z.string(),
  SkiNr: z.string().min(1, "Darf nicht leer sein").max(100, "Darf nicht länger als 100 Zeichen sein"),
});
export type SkiCreate = z.infer<typeof SkiCreateSchema>;

export const SkiSchema = z.object({
  Modell_ID: z.number(),
  Laenge: z.number(),
  VK: z.number(),
  EK: z.number(),
  Saison: z.string(),
  SkiNr: z.string(),
  ID: z.number(),
  Modell: ModellSchema,
  Ausgemustert: z.boolean().default(false),
  // Steckt der Ski in einem Verleih
  ImVerleih: z.boolean().default(false),
});

export const SkiArraySchema = z.array(SkiSchema);
export type SkiArray = z.infer<typeof SkiArraySchema>;
export type Ski = z.infer<typeof SkiSchema>;



// Schuhschema
export const SchuhHerstellerSchema = z.object({
  Name: z.string(),
  ID: z.number(),
});

export const SchuhModellSchema = z.object({
  Modell: z.string(),
  Jugend: z.boolean(),
  Hersteller_ID: z.number(),
  ID: z.number(),
  Hersteller: HerstellerSchema,
});

export type SchuhModell = z.infer<typeof SchuhModellSchema>;
export const SchuhModellArraySchema = z.array(SchuhModellSchema);
export type SchuhModellArray = z.infer<typeof SchuhModellArraySchema>;

export const SchuhModellCreateSchema = z.object({
  Modell: z.string(),
  Jugend: z.boolean(),
  Hersteller_ID: z.number(),
})

export type SchuhModellCreate = z.infer<typeof SchuhModellCreateSchema>;



// Skischuh
export const CreateSchuhSchema = z.object({
  Modell_ID: z.number(),
  // Eigene Nummer, z.B. Inventur-Aufkleber. Leer = interne ID
  SchuhNr: z.string().max(50, "Höchstens 50 Zeichen").optional(),
  Groese: z.number(),
  // Sohlenlänge in mm, optional
  Sohle: z.number({ error: "Bitte eine Zahl eingeben" }).int("Bitte ganze mm eingeben").min(150, "Mindestens 150 mm").max(400, "Höchstens 400 mm").optional(),
  Saison: z.string(),
  VK: z.number(),
  EK: z.number(),
});
export type CreateSkiSchuh = z.infer<typeof CreateSchuhSchema>;

export const SchuhSchema = z.object({
  Modell_ID: z.number(),
  Groese: z.number(),
  Sohle: z.number().nullish(),
  Saison: z.string(),
  VK: z.number(),
  EK: z.number(),
  ID: z.number(),
  // Sichtbare Schuh-Nr., Standard ist die ID
  SchuhNr: z.string(),
  Ausgemustert: z.boolean().default(false),
  // Steckt der Schuh in einem Verleih
  ImVerleih: z.boolean().default(false),
  Modell: SchuhModellSchema,
});

export const SchuhArraySchema = z.array(SchuhSchema);

export type Schuh = z.infer<typeof SchuhSchema>;
export type SchuhArray = z.infer<typeof SchuhArraySchema>;



// Für Skistock
export const SkistockSchema = z.object({
  ID: z.number(),
  Bezeichnung: z.string(),
  Ausgemustert: z.boolean().default(false),
  // Steckt der Stock in einem Verleih
  ImVerleih: z.boolean().default(false),
})

export const SkistockCreateSchema = z.object({
  Bezeichnung: z.string().min(1, "Darf nicht leer sein").max(100, "Darf nicht länger als 100 Zeichen sein"),
})

export type SkistockCreate = z.infer<typeof SkistockCreateSchema>;

// Skistock Einzeln
export type Skistock = z.infer<typeof SkistockSchema>;

// Skistock Mehrfach
export const SkistockArraySchema = z.array(SkistockSchema);
export type SkistockArray = z.infer<typeof SkistockArraySchema>;

// Für MaterialEingabe
export const MaterialSchema = z.object({
  Preis: z.number().positive('Bitte wählen oder geben Sie einen Preis ein'),
  skinr: z.string(),
  stockbez_ID: z.number(),
  stocklaenge: z.number(),
  // Interne ID des Schuhs (aus der Nummernprüfung)
  schuhnr: z.number().optional(),
  // Eingegebene bzw. angezeigte Schuh-Nr.
  schuhAnzeige: z.string().optional(),
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


// --- Bearbeiten / Ausmustern / Löschen ---

// Ein Verleih, in dem ein Ski, Schuh oder Stock steckt
export const VerleihVerwendungSchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Art: z.string(),
  Start_Am: z.string().nullish(),
  Ende_Am: z.string().nullish(),
  Kunde: z.string(),
  Fahrer: z.string().nullish(),
  Zurueck: z.boolean(),
});
export const VerleihVerwendungListeSchema = z.array(VerleihVerwendungSchema);
export type VerleihVerwendung = z.infer<typeof VerleihVerwendungSchema>;

// Wie oft ein Hersteller oder Modell noch verwendet wird
export const StammdatenVerwendungSchema = z.object({
  Anzahl: z.number(),
  Beispiele: z.array(z.string()),
});
export type StammdatenVerwendung = z.infer<typeof StammdatenVerwendungSchema>;

// Antwort beim Ändern eines Ski: Anzahl der auf die neue Ski-Nr. umgestellten Verleihe
export const SkiAenderungSchema = SkiSchema.extend({
  UmgestellteVerleihe: z.number().default(0),
});
