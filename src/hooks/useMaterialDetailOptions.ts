import { queryOptions } from "@tanstack/react-query";

import { holeSchuhDetails, holeSkiDetails } from "@/lib/materialdetailactions";

// Detailseite eines Leihskis: Verleihe, Services und Erwirtschaftetes
export const skiDetailsOptions = (skiID: number) => queryOptions({
    queryKey: ["material", "ski", skiID],
    queryFn: async () => {
        const antwort = await holeSkiDetails(skiID);
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
});

// Detailseite eines Leihschuhs
export const schuhDetailsOptions = (schuhID: number) => queryOptions({
    queryKey: ["material", "schuh", schuhID],
    queryFn: async () => {
        const antwort = await holeSchuhDetails(schuhID);
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
});
