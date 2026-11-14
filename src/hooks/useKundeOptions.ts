import { queryOptions } from "@tanstack/react-query";

import { holeKunde, holeKundeHistorie } from "@/lib/kundeactions";

// Kunde der Kundenseite
export const kundeOptions = (kundeID: number) => queryOptions({
    queryKey: ["kunde", kundeID],
    queryFn: async () => {
        const antwort = await holeKunde(kundeID);
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
});

// Aufträge, Verleihe und Quittungen des Kunden über alle Saisons
export const kundeHistorieOptions = (kundeID: number) => queryOptions({
    queryKey: ["kunde", kundeID, "historie"],
    queryFn: async () => {
        const antwort = await holeKundeHistorie(kundeID);
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
});
