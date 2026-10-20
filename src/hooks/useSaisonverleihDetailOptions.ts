import { queryOptions } from "@tanstack/react-query";

import { getSaisonVerleihById } from "@/lib/saisonverleihactions";


export const saisonverleihDetailsOptions = (saisonverleihID: number) => queryOptions({
    queryKey: ["saisonverleihDetails", saisonverleihID],
    queryFn: async () => {
        const verleih = await getSaisonVerleihById(saisonverleihID);
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!verleih) throw new Error("Saisonverleih konnte nicht geladen werden");
        return verleih;
    },
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
});