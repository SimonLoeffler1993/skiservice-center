import { queryOptions } from "@tanstack/react-query";

import { holeMailProtokoll } from "@/lib/mailprotokollactions";
import { MailProtokollBezug } from "@/types/mailprotokolltypes";

// Wer eine Mail auslöst, macht ["mailProtokoll"] ungültig
export const mailProtokollOptions = (bezug: MailProtokollBezug, id: number) => queryOptions({
    queryKey: ["mailProtokoll", bezug, id],
    queryFn: async () => {
        const antwort = await holeMailProtokoll(bezug, id);
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    // Mails entstehen auch an der Kasse und am Scanner: beim Öffnen immer frisch laden
    staleTime: 0,
});
