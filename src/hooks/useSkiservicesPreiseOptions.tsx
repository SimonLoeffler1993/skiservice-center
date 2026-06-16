import { queryOptions } from "@tanstack/react-query";

import { getSkiservicesPreise } from "@/lib/skiservicepreiseactions";


export const skiservicesPreiseOptions = queryOptions({
    queryKey: ["skiservicesPreise"],
    queryFn: () => getSkiservicesPreise(),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
});