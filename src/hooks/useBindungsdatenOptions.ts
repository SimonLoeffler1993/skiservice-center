import { queryOptions } from "@tanstack/react-query";
import { getBindungsdaten } from "@/lib/bindungsdatenactions";

export const bindungsdatenOptions = (kundeId: number, mitArchiv: boolean) => queryOptions({
    queryKey: ["bindungsdaten", kundeId, mitArchiv],
    queryFn: async () => {
        const antwort = await getBindungsdaten(kundeId, mitArchiv);
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    staleTime: 1000 * 30,
});
