// types/quittungtypes.ts
import { z } from "zod"

// TODO Gesamt Betrag in Quittungstypen aufnehmen,
export const BezahlInfoSchema = z.object({
    Bezahlt: z.boolean(),
    Bezahlt_Am: z.string().date().nullable().optional(),
    Offener_Betrag: z.number().nullable().optional(),
})

export const QuittungBaseSchema = z.object({
    Name: z.string(),
    AnzAuftrag: z.number().int(),
    AnzVerleih: z.number().int(),
    Saison_ID: z.number().int(),
    Bezahlt_Am: z.string().date().nullable().optional(),
    Erstellt_Am: z.string().date().nullable().optional(),
    Ueberweisung: z.boolean(),
    Bezahlt: z.boolean(),
    BuchhaltungSync: z.boolean(),
    LexID: z.string().nullable().optional(),
    BezahlInfo: BezahlInfoSchema.nullable().optional(),
})

export const QuittungCreateSchema = QuittungBaseSchema

export const QuittungUpdateSchema = z.object({
    Name: z.string().nullable().optional(),
    AnzAuftrag: z.number().int().nullable().optional(),
    AnzVerleih: z.number().int().nullable().optional(),
    Saison_ID: z.number().int().nullable().optional(),
    Bezahlt_Am: z.string().date().nullable().optional(),
    Erstellt_Am: z.string().date().nullable().optional(),
    Ueberweisung: z.boolean().nullable().optional(),
    Bezahlt: z.boolean().nullable().optional(),
    BuchhaltungSync: z.boolean().nullable().optional(),
    LexID: z.string().nullable().optional(),
})

export const QuittungReadSchema = QuittungBaseSchema.extend({
    ID: z.number().int(),
    // Beleg existiert nur in Lexware (zugewiesen oder direkt als Rechnung angelegt)
    NurExtern: z.boolean().nullish(),
    // Aktuelle Lexware Übertragung, null wenn aus
    LexwareModus: z.enum(["pdf", "rechnung"]).nullish(),
})

// TypeScript Typen aus den Schemas ableiten
export type BezahlInfo = z.infer<typeof BezahlInfoSchema>
export type QuittungBase = z.infer<typeof QuittungBaseSchema>
export type QuittungCreate = z.infer<typeof QuittungCreateSchema>
export type QuittungUpdate = z.infer<typeof QuittungUpdateSchema>
export type QuittungRead = z.infer<typeof QuittungReadSchema>

// --- Quittungsliste (Verwalten → Quittungen) ---

export const QuittungArtikelSchema = z.object({
    bezeichnung: z.string(),
    preis: z.number(),
    anzahl: z.number().int(),
})

export const QuittungGruppeSchema = z.object({
    type: z.string(),
    toID: z.number().int(),
    bezeichnung: z.string(),
    artikels: z.array(QuittungArtikelSchema),
})

export const QuittungListeEintragSchema = z.object({
    ID: z.number().int(),
    Name: z.string().nullish(),
    Erstellt_Am: z.string().nullish(),
    Bezahlt_Am: z.string().nullish(),
    Bezahlt: z.boolean(),
    // z.B. "Bar" oder "EC, Überweisung"
    Zahlart: z.string(),
    Betrag: z.number(),
    // Kundenname bzw. "Sammelkunde"
    Kunde: z.string().nullish(),
    Bezuege: z.array(z.object({ art: z.enum(["auftrag", "verleih"]), id: z.number().int(), name: z.string().nullish() })),
    NurExtern: z.boolean(),
    LexID: z.string().nullish(),
    BuchhaltungSync: z.boolean(),
    artikelgruppen: z.array(QuittungGruppeSchema),
})
export const QuittungListeSchema = z.array(QuittungListeEintragSchema)
export type QuittungListeEintrag = z.infer<typeof QuittungListeEintragSchema>
