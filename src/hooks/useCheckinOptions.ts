import { queryOptions } from "@tanstack/react-query";

import { holeCheckins, holeCheckinSchluessel, holeCheckinStatus } from "@/lib/checkinactions";
import { ApiAntwort } from "@/types/actiontypes";

// Fehler werfen, damit TanStack Query den Fehlerzustand setzt
function daten<T>(antwort: ApiAntwort<T>): T {
    if (!antwort.success) throw new Error(antwort.error);
    return antwort.data;
}

export const checkinStatusOptions = queryOptions({
    queryKey: ["checkin", "status"],
    queryFn: async () => daten(await holeCheckinStatus()),
    refetchInterval: 30_000,
});

export const checkinListeOptions = queryOptions({
    queryKey: ["checkin", "liste"],
    queryFn: async () => daten(await holeCheckins()),
    // Klartext nur so kurz wie nötig im Speicher halten
    gcTime: 0,
    staleTime: 0,
    retry: false,
});

export const checkinSchluesselOptions = queryOptions({
    queryKey: ["checkin", "schluessel"],
    queryFn: async () => daten(await holeCheckinSchluessel()),
});
