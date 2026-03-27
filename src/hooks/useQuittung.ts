import { useSuspenseQuery } from "@tanstack/react-query";

import { getQuittung } from "@/lib/quittungactions";
import { QuittungRead } from "@/types/quittungentypes";



export function useQuittung(quittungID: number, initialData?: QuittungRead) {
    return useSuspenseQuery({
        queryKey: ["quittung", quittungID],
        queryFn: () => getQuittung(quittungID),
        initialData: initialData ?? undefined
    });


}