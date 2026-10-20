import { queryOptions } from "@tanstack/react-query";
import { getEinstellungen } from "@/lib/einstellungenactions";

export const einstellungenOptions = queryOptions({
    queryKey: ["einstellungen"],
    queryFn: async () => {
        const antwort = await getEinstellungen();
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    staleTime: 1000 * 60 * 5,
});
