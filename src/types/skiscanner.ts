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
    // "verleih": Scan eines Verleih-Etiketts am Hardware-Scanner, ohne data
    art: z.enum(["service", "verleih"]).nullish(),
    verleih_id: z.number().int().nullish(),
    verleih_name: z.string().nullish(),
    kunde: z.string().nullish(),
    mail: MailStatusSchema.nullish(),
    // Was nach dem Countdown passiert: Ski fertig stellen oder Bindung als geprüft markieren
    aktion: z.enum(["fertig", "bindung"]).nullish(),
    // Gescannte Materialzeile eines Verleih-Etiketts
    material_id: z.number().int().nullish(),
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
    // Firmware kann sich selbst aktualisieren, ältere Firmware meldet das nicht
    update_faehig: z.boolean().default(false),
    // Stand des Selbst-Updates laut Scanner: "pruefe" / "laedt" / "aktuell" / "fehlgeschlagen", sonst leer
    update_status: z.string().nullish(),
    update_fehler: z.string().nullish(),
    // Im Center angestoßen, der Scanner hat noch nicht reagiert
    update_angefordert: z.string().nullish(),
});

// manifest.json des Webflashers (GitHub Pages), hier zählt nur die Version
export const FirmwareManifestSchema = z.object({ version: z.string().min(1) });

export const ScannerGeraetListeSchema = z.array(ScannerGeraetSchema);

export type ScannerGeraet = z.infer<typeof ScannerGeraetSchema>;
