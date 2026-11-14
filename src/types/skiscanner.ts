import { z } from "zod";
import { AuftragSchema } from "./skiservicetypes";

// Ergebnis einer automatischen Kundenmail (Fertig-Mail, Abhol-Mail), ohne Wert war keine fällig
export const MailStatusSchema = z.enum(["gesendet", "fehlgeschlagen"]);
export type MailStatus = z.infer<typeof MailStatusSchema>;

export const ScannerWebSocketMessageSchema = z.object({
    message: z.string(),
    success: z.boolean(),
    scannername: z.string().nullable().optional(),
    ski_id: z.number().int().nullable().optional(),
    service_id: z.number().int().nullable().optional(),
    data: AuftragSchema.nullable().optional(),
    // "verleih": Bindungsscan eines Verleih-Etiketts am Hardware-Scanner, ohne data
    art: z.enum(["service", "verleih"]).nullish(),
    verleih_id: z.number().int().nullish(),
    verleih_name: z.string().nullish(),
    kunde: z.string().nullish(),
    mail: MailStatusSchema.nullish(),
});

export type ScannerWebSocketMessage = z.infer<typeof ScannerWebSocketMessageSchema>;

// Hardware-Scanner, die sich beim Backend melden (Health-Check alle 30 s)
export const ScannerGeraetSchema = z.object({
    name: z.string(),
    // 0 = Bearbeitung, 1 = Fertigstellen, 2 = Bindung prüfen
    modus: z.number().int(),
    firmware: z.string().nullable(),
    ip: z.string().nullable(),
    usb_scanner: z.boolean(),
    zuletzt: z.string(),
    verbunden: z.boolean(),
});

export const ScannerGeraetListeSchema = z.array(ScannerGeraetSchema);

export type ScannerGeraet = z.infer<typeof ScannerGeraetSchema>;
