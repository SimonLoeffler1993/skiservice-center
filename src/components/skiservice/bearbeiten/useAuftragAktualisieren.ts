import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { Auftrag } from "@/types/skiservicetypes";

// Schreibt den vom Backend zurückgegebenen Auftrag direkt in den Cache der Detailansicht
export function useAuftragAktualisieren(auftragId: number) {
    const queryClient = useQueryClient();
    return useCallback((auftrag: Auftrag) => {
        queryClient.setQueryData(auftragDetailsOptions(auftragId).queryKey, { success: true, error: null, data: auftrag });
    }, [queryClient, auftragId]);
}
