import { z } from "zod";
import { AuftragSchema } from "./skiservicetypes";

export const ScannerWebSocketMessageSchema = z.object({
    message: z.string(),
    success: z.boolean(),
    scannername: z.string().nullable().optional(),
    ski_id: z.number().int().nullable().optional(),
    service_id: z.number().int().nullable().optional(),
    data: AuftragSchema.nullable().optional(),
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
