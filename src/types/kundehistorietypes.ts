import { z } from "zod";

import { QuittungListeEintrag, QuittungListeSchema } from "./quittungentypes";
import { SaisonverleihRead } from "./saisonverleihtypes";
import { Auftrag } from "./skiservicetypes";

// Antwort der API. Aufträge und Verleihe werden einzeln geprüft (siehe holeKundeHistorie),
// damit ein alter Datensatz mit abweichenden Werten nicht die ganze Historie unlesbar macht
export const KundeHistorieRohSchema = z.object({
    auftraege: z.array(z.unknown()),
    verleihe: z.array(z.unknown()),
    quittungen: QuittungListeSchema,
});

// Alles, was ein Kunde bisher hatte, über alle Saisons und neueste zuerst
export type KundeHistorie = {
    auftraege: Auftrag[];
    verleihe: SaisonverleihRead[];
    // Über die Aufträge und Verleihe ermittelt, also auch Sammelquittungen mit anderen Kunden
    quittungen: QuittungListeEintrag[];
    // Anzahl der Aufträge und Verleihe, die nicht gelesen werden konnten
    unlesbar: number;
};
