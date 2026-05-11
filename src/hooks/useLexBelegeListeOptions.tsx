import { getQuittungsBelegeListe } from "@/lib/quittungactions";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";


export const lexBelegeListeOptions = () => queryOptions({
    queryKey: ["lexBelegeListe"],
    queryFn: () => getQuittungsBelegeListe(),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
})


export const lexBeelegeListInfiniteOptions = () => infiniteQueryOptions({
    queryKey: ["lexBelegeListeInfinite"],
    queryFn: ({ pageParam }) => getQuittungsBelegeListe(pageParam),
    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
        // Wenn lastPage nicht definiert ist, gibt es keine weiteren Seiten, daher return undefined
        if (!lastPage) return undefined

        // Paging wird von Lexoffice über die Seite gesteuert, die zurückgegeben wird. Wenn die letzte Seite
        // https://developers.lexware.io/docs/#paging-of-resources
        const page = lastPage.number
        const letztePage = lastPage.last

        if (!letztePage) {
            return page + 1
        } else {
            return undefined
        }
    }
})