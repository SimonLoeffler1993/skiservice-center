import { queryOptions } from "@tanstack/react-query";

import { getQuittung } from "@/lib/quittungactions";

export const quittungOptions =  (quittungID: number) => queryOptions({
    queryKey: ["quittung", quittungID],
    queryFn: () => getQuittung(quittungID),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
});