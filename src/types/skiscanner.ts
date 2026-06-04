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