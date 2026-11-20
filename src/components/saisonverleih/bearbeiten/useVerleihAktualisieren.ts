import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";

// Schreibt den vom Backend zurückgegebenen Verleih in den Cache und lädt die Liste neu
export function useVerleihAktualisieren(verleihId: number) {
    const queryClient = useQueryClient();
    return useCallback((verleih: SaisonverleihRead) => {
        queryClient.setQueryData(saisonverleihDetailsOptions(verleihId).queryKey, verleih);
        queryClient.invalidateQueries({ queryKey: ["saisonverleihList"] });
        // Die Änderung kann eine Mail ausgelöst haben (Abholung, Rückgabe)
        queryClient.invalidateQueries({ queryKey: ["mailProtokoll"] });
        queryClient.invalidateQueries({ queryKey: ["verlauf"] });
    }, [queryClient, verleihId]);
}
