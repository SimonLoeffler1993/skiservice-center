import { z } from "zod";

export const skiSuchKundeSchema = z.object({
    Vorname: z.string(),
    Nachname: z.string(),
}).refine(
    (data) => data.Vorname.trim() !== "" || data.Nachname.trim() !== "",
    {
        message: "Mindestens ein teil vom Vorname oder Nachname angegeben",
        path: ["Vorname"],
    }
);

export type SkiSuchKunde = z.infer<typeof skiSuchKundeSchema>;

export const ortSchema = z.object({
  Postlz: z.number(),
  Ort: z.string(),
});

export const kundeSchema = z.object({
  ID: z.number(),
  Nachname: z.string().nullish(),
  Vorname: z.string().nullish(),
  Strasse: z.string().nullish(),
  Ort: ortSchema.nullish(),
  Tel: z.string().nullish(),
  Handy: z.string().nullish(),
  Email: z.email().or(z.literal("")).nullish(), // historische Daten können "" enthalten
});

// Hauptschema als Array
export const kundenArraySchema = z.array(kundeSchema);

export type Kunde = z.infer<typeof kundeSchema>;

// Typen für TypeScript
export type Ort = z.infer<typeof ortSchema>;
export type Person = z.infer<typeof kundeSchema>;