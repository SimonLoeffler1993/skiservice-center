import { getSkiserviceListe } from "@/lib/auftragaction";
import { ListenSortierung } from "@/types/liste";
import { infiniteQueryOptions } from "@tanstack/react-query";

export const serviceListeOptions = (saisonID: number, sortierung: ListenSortierung = "neueste", suche: string = "") =>
    infiniteQueryOptions({
        queryKey: ["skiserviceList", saisonID, sortierung, suche],
        queryFn: ({ pageParam }) => getSkiserviceListe(25, pageParam, saisonID, sortierung, suche),

        // undefined = kein last_id beim ersten Aufruf
        initialPageParam: undefined as number | undefined,

        getNextPageParam: (lastPage, allPages) => {
            // console.log("lastPage:", lastPage);
            // console.log("lastPage.at(-1):", lastPage?.at(-1));
            // console.log("allPages:", allPages);
            // Leere Seite oder weniger als pageSize = kein nächster Cursor
            if (!lastPage || lastPage.length < 25) return undefined;
            return lastPage.at(-1)?.id
        },

        gcTime: 1000 * 60 * 60,
        staleTime: 1000 * 60 * 5,
    })