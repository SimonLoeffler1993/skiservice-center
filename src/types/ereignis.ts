import { z } from "zod";

export const EreignisSchema = z.object({
    id: z.number(),
    zeitpunkt: z.string(),
    art: z.string(),
    art_bezeichnung: z.string(),
    benutzer_id: z.number().nullish(),
    benutzer_name: z.string().nullish(),
    geraet: z.string().nullish(),
    kunde_id: z.number().nullish(),
    auftrag_id: z.number().nullish(),
    verleih_id: z.number().nullish(),
    quittung_id: z.number().nullish(),
    text: z.string(),
});
export type Ereignis = z.infer<typeof EreignisSchema>;
export const EreignisListeSchema = z.array(EreignisSchema);

export type VerlaufBezug = "auftrag" | "verleih" | "quittung";
