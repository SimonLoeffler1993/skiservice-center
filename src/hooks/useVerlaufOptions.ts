import { queryOptions } from "@tanstack/react-query";

import { holeVerlauf } from "@/lib/verlaufactions";
import type { VerlaufBezug } from "@/types/ereignis";

// Wer etwas am Auftrag/Verleih ändert, macht ["verlauf"] ungültig
export const verlaufOptions = (bezug: VerlaufBezug, id: number) => queryOptions({
    queryKey: ["verlauf", bezug, id],
    queryFn: async () => {
        const antwort = await holeVerlauf(bezug, id);
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    staleTime: 0,
});
