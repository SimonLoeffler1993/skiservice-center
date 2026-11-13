import { queryOptions } from "@tanstack/react-query";
import { holeMailvorlagen } from "@/lib/mailvorlagenactions";

export const mailvorlagenOptions = queryOptions({
    queryKey: ["mailvorlagen"],
    queryFn: async () => {
        const antwort = await holeMailvorlagen();
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    staleTime: 1000 * 60 * 5,
});
