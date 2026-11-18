import { z } from "zod";

// Eine an den Kunden versendete Mail aus dem Mail-Protokoll der API
export const MailProtokollEintragSchema = z.object({
    ID: z.number(),
    // ISO-Zeitpunkt des Sendeversuchs
    Gesendet_Am: z.string(),
    // Schlüssel der Mail-Vorlage, z.B. "skiservice_fertig"
    Vorlage: z.string(),
    Empfaenger: z.string(),
    Betreff: z.string(),
    // Fertiges HTML, so wie es versendet wurde
    Inhalt: z.string(),
    Erfolgreich: z.boolean(),
    Fehler: z.string().nullish(),
    Kunde_ID: z.number().nullish(),
    Auftrag_ID: z.number().nullish(),
    Verleih_ID: z.number().nullish(),
    // Quittungs-Mail: die angehängte Quittung, das PDF selbst wird nicht gespeichert
    Quittung_ID: z.number().nullish(),
    Quittung_Nummer: z.string().nullish(),
    // Auftrag bzw. Verleih der Mail, bei einer Quittungs-Mail alle auf der Quittung
    Bezuege: z.array(z.object({ art: z.enum(["auftrag", "verleih"]), id: z.number().int(), name: z.string().nullish() })).default([]),
});
export type MailProtokollEintrag = z.infer<typeof MailProtokollEintragSchema>;

export const MailProtokollSchema = z.array(MailProtokollEintragSchema);

// Wozu die Mails gesucht werden
export type MailProtokollBezug = "kunde" | "auftrag" | "verleih";
