import { queryOptions } from "@tanstack/react-query";
import { getSkiHersteller, getSchuhModelle } from "@/lib/materialactions";

export const schuhHerstellerOptions = queryOptions({
    queryKey: ["schuhHersteller"],
    queryFn: () => getSkiHersteller(true),
    gcTime: 1000 * 60 * 60, // 1 Stunde
    staleTime: 1000 * 60 * 5, // 5 Minuten
});

export const schuModelleOptions = queryOptions({
    queryKey: ["schuhModelle"],
    queryFn: () => getSchuhModelle(),
    gcTime: 1000 * 60 * 60, // 1 Stunde
    staleTime: 1000 * 60 * 5, // 5 Minuten
})