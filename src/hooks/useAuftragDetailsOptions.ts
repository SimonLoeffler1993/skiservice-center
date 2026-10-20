import { getAuftragLesen } from "@/lib/auftragaction";
import { queryOptions } from "@tanstack/react-query";

export const auftragDetailsOptions = (serviceAuftragID: number) => queryOptions({
    queryKey: ["serviceAuftragDetails", serviceAuftragID],
    queryFn: async () => {
        const antwort = await getAuftragLesen(serviceAuftragID);
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error ?? "Auftrag konnte nicht geladen werden");
        return antwort;
    },
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
})