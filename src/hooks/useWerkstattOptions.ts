import { queryOptions } from "@tanstack/react-query";
import { holeWerkstattUebersicht } from "@/lib/werkstattactions";

// Werkstatt-Dashboard, regelmäßig neu geladen (zusätzlich bei jeder Scanner-Meldung)
export const werkstattOptions = queryOptions({
    queryKey: ["werkstatt"],
    queryFn: async () => {
        const antwort = await holeWerkstattUebersicht();
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    refetchInterval: 30_000,
});
