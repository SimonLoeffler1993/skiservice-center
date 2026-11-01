import { queryOptions } from "@tanstack/react-query";
import { holeScannerGeraete } from "@/lib/skiscanneractions";

// Hardware-Scanner mit Verbindungsstatus, regelmäßig neu geladen
export const scannerGeraeteOptions = queryOptions({
    queryKey: ["scannerGeraete"],
    queryFn: async () => {
        const antwort = await holeScannerGeraete();
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    refetchInterval: 10_000,
});
