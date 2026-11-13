import { z } from "zod";

import { VerleihArtSchema } from "./saisonverleihtypes";

// Ski aus einem Skiservice-Auftrag, an dem noch etwas zu tun ist
export const WerkstattSkiSchema = z.object({
    ski_id: z.number().int(),
    ski_name: z.string().nullish(),
    auftrag_id: z.number().int(),
    auftrag_name: z.string().nullish(),
    kunde_name: z.string(),
    service: z.string(),
    komentar: z.string().nullish(),
    // Leistung noch nicht fertig
    service_offen: z.boolean(),
    // Bindungscheck beauftragt, aber noch nicht geprüft
    bindung_offen: z.boolean(),
    // Fertig-bis-Datum "TT.MM.JJJJ"
    abhol_date: z.string().nullish(),
});
export type WerkstattSki = z.infer<typeof WerkstattSkiSchema>;

// Verleih in Vorbereitung
export const WerkstattVerleihSchema = z.object({
    ID: z.number().int(),
    Name: z.string(),
    Art: VerleihArtSchema,
    kunde_name: z.string(),
    Start_Am: z.string().nullish(),
    Ende_Am: z.string().nullish(),
    material_gesamt: z.number().int(),
    material_geprueft: z.number().int(),
});
export type WerkstattVerleih = z.infer<typeof WerkstattVerleihSchema>;

// Anzahl heute, in den letzten 7 Tagen und in der Saison
export const ZeitraumSchema = z.object({
    heute: z.number().int(),
    woche: z.number().int(),
    saison: z.number().int(),
});
export type Zeitraum = z.infer<typeof ZeitraumSchema>;

export const WerkstattAuswertungSchema = z.object({
    eingestellt_service: ZeitraumSchema,
    eingestellt_verleih: ZeitraumSchema,
    service_fertig: ZeitraumSchema,
    ski_gesamt: z.number().int(),
    bindung_gesamt: z.number().int(),
    service_offen: z.number().int(),
    bindung_offen: z.number().int(),
    verleih_material_gesamt: z.number().int(),
    verleih_bindung_offen: z.number().int(),
});
export type WerkstattAuswertung = z.infer<typeof WerkstattAuswertungSchema>;

export const VerleihStatusZahlenSchema = z.object({
    vorbereitung: z.number().int(),
    vorbereitet: z.number().int(),
    unterwegs: z.number().int(),
    zurueck: z.number().int(),
    gesamt: z.number().int(),
    unbezahlt: z.number().int(),
    // Nur Tagesverleih: unterwegs und letzter Verleihtag erreicht
    rueckgabe_faellig: z.number().int(),
});
export type VerleihStatusZahlen = z.infer<typeof VerleihStatusZahlenSchema>;

export const WerkstattUebersichtSchema = z.object({
    saison: z.object({ ID: z.number().int(), Name: z.string() }),
    ski_offen: z.array(WerkstattSkiSchema),
    verleih_offen: z.array(WerkstattVerleihSchema),
    auswertung: WerkstattAuswertungSchema,
    verleih: z.object({ saison: VerleihStatusZahlenSchema, tag: VerleihStatusZahlenSchema }),
});
export type WerkstattUebersicht = z.infer<typeof WerkstattUebersichtSchema>;
