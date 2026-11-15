import { queryOptions } from "@tanstack/react-query";
import { holeNeuesteFirmware, holeScannerGeraete } from "@/lib/skiscanneractions";

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

// Neueste veröffentlichte Firmware-Version (Manifest des Webflashers), null wenn nicht abrufbar
export const neuesteFirmwareOptions = queryOptions({
    queryKey: ["scannerFirmware"],
    queryFn: async () => {
        const antwort = await holeNeuesteFirmware();
        return antwort.success ? antwort.data : null;
    },
    staleTime: 10 * 60_000,
});
