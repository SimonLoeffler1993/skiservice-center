import { infiniteQueryOptions } from "@tanstack/react-query";
import { getSaisonVerleihList } from "@/lib/saisonverleihactions";
import { ListenSortierung } from "@/types/liste";
import { VerleihArt } from "@/types/saisonverleihtypes";

// art: nur Saison- oder nur Tagesverleihe, ohne Angabe alle
export const saisonverleihListOptions = (saisonID: number, art?: VerleihArt, sortierung: ListenSortierung = "aelteste", suche: string = "") =>
    infiniteQueryOptions({
        queryKey: ["saisonverleihList", saisonID, art ?? "alle", sortierung, suche],
        queryFn: ({ pageParam }) => getSaisonVerleihList(15, pageParam, saisonID, art, sortierung, suche),

        // undefined = kein last_id beim ersten Aufruf
        initialPageParam: undefined as number | undefined,

        getNextPageParam: (lastPage, allPages) => {
            // console.log("lastPage:", lastPage);
            // console.log("lastPage.at(-1):", lastPage?.at(-1));
            // console.log("allPages:", allPages);
            if (!lastPage || lastPage.length === 0) return undefined;
            return lastPage.at(-1)?.ID
        },

        gcTime: 1000 * 60 * 60,
        staleTime: 1000 * 60 * 5,
    });