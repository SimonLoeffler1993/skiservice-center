import { z } from "zod";
import { kundeSchema } from "./skikundentypes";

export const SkiSchema = z.object({
    id: z.number().int(),
    auftrag_id: z.number().int(),
    service: z.string(),
    preis: z.number(),
    status: z.number().int().nullable().optional(),
    komentar: z.string().nullable().optional(),
    dabei: z.number().int().nullable().optional(),
    fertig_date: z.string().nullable().optional(),
    bindung_id: z.number().int(),
    bindung_check: z.boolean().default(false),
    bindung_preis: z.number().int(),
    name: z.string().nullable().optional(),
    band: z.number().int(),
    sack: z.number().int(),
    bindung_status: z.boolean().default(false),
    gepueft: z.iso.date().nullable().optional(), // ISO date string "YYYY-MM-DD"
});

// Wie = Status 0: in Bearbeitung 1: fertig 2: abgeholt
export const AuftragSchema = z.object({
    id: z.number().int(),
    kunden_id: z.number().int(),
    kunde: kundeSchema,
    start_date: z.iso.datetime({ offset: true, local: true }), // ISO datetime, local = bedeutet ohne Zeitzone
    ende_date: z.string().nullable().optional(),
    // wie: z.string().nullable().optional(),
    wie: z.enum(["0", "1", "2"]).nullable().optional(),
    a_ski: z.string().nullable().optional(),
    ettiket: z.string().nullable().optional(),
    zu: z.string(),
    fertig_date: z.string().nullable().optional(),
    abhol_date: z.string().nullable().optional(),
    anzahlung: z.string().nullable().optional(),
    bezahlt: z.enum(["ja", "nein"]),
    bezahlt_am: z.iso.date().nullable().optional(), // ISO date string "YYYY-MM-DD"
    benachrichtigt: z.string(),
    abgerechnet: z.number().int().nullable().optional(),
    uberweisung: z.number().int().nullable().optional(),
    name: z.string().nullable().optional(),
    anz_leih: z.number().int().nullable().optional(),
    rabat: z.number().nullable().optional(),
    rabat_name: z.string().nullable().optional(),
    rabat_waerung: z.number().int().nullable().optional(),
    leih_versicherung: z.number().int().nullable().optional(),
    quittung_id: z.number().int().nullable().optional(),

    skis: z.array(SkiSchema).default([]),
});

export type Ski = z.infer<typeof SkiSchema>;
export type Auftrag = z.infer<typeof AuftragSchema>;

// Mehrfach für Übersicht
export const AuftragListeSchema = z.array(AuftragSchema)
export type AuftragListe = z.infer<typeof AuftragListeSchema>;

export const SkiserviceEintragSchema = z.object({
    service: z.string(),
    preis: z.number(),
    bindung_check: z.boolean(),
    bindung_preis: z.number()
});

export type SkiserviceEintrag = z.infer<typeof SkiserviceEintragSchema>;


export const AntwortSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(false),
    error: z.string(),
    data: z.null(),
  }),
  z.object({
    success: z.literal(true),
    error: z.null(),
    data: AuftragSchema,
  }),
]);

export type Antwort = z.infer<typeof AntwortSchema>;
