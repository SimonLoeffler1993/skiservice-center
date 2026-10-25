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

// Neuen Kunden im Center erfassen (gleiche Regeln wie API und Kundendialog)
export const kundeErfassenSchema = z
    .object({
        Vorname: z.string().trim().max(100, "Höchstens 100 Zeichen"),
        Nachname: z.string().trim().max(100, "Höchstens 100 Zeichen"),
        Strasse: z.string().trim().max(250, "Höchstens 250 Zeichen"),
        Plz: z.string().trim().regex(/^(\d{5})?$/, "Bitte 5 Ziffern eingeben"),
        Ort: z.string().trim(),
        Tel: z.string().trim().max(50, "Höchstens 50 Zeichen"),
        Handy: z.string().trim().max(50, "Höchstens 50 Zeichen"),
        Email: z.email("Ungültige E-Mail-Adresse").or(z.literal("")),
    })
    .refine((d) => d.Vorname !== "" || d.Nachname !== "", {
        message: "Mindestens Vorname oder Nachname angeben.",
        path: ["Vorname"],
    })
    .refine((d) => d.Tel !== "" || d.Handy !== "" || d.Email !== "", {
        message: "Mindestens Telefon, Handy oder E-Mail angeben.",
        path: ["Tel"],
    });

export type KundeErfassen = z.infer<typeof kundeErfassenSchema>;
