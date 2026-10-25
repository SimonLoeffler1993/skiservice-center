import { queryOptions } from "@tanstack/react-query";

import { getOrte } from "@/lib/kundeactions";

// Orte zu einer PLZ, erst ab 5 Ziffern. PLZ ändern sich nicht, deshalb kein erneutes Laden
export const orteOptions = (plz: string) => queryOptions({
    queryKey: ["orte", plz],
    queryFn: () => getOrte(plz),
    enabled: /^\d{5}$/.test(plz),
    staleTime: Infinity,
});
