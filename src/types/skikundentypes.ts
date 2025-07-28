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

// Hauptschema für Kunde
export const kundeSchema = z.object({
  ID: z.number(),
  Nachname: z.string(),
  Vorname: z.string(),
  Strasse: z.string(),
  Ort: ortSchema,
  Tel: z.string(),
  Email: z.string().email().or(z.literal("")), // erlaubt auch leeren String
});

// Hauptschema als Array
export const kundenArraySchema = z.array(kundeSchema);

export type Kunde = z.infer<typeof kundeSchema>;

// Typen für TypeScript
export type Ort = z.infer<typeof ortSchema>;
export type Person = z.infer<typeof kundeSchema>;