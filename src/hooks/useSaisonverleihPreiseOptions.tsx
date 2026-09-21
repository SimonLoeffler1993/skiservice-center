import { queryOptions } from "@tanstack/react-query";
import { getSaisonVerleihPreis } from "@/lib/saisonverleihactions";

export const saisonverleihPreiseOptions = queryOptions({
    queryKey: ["saisonverleihPreise"],
    queryFn: () => getSaisonVerleihPreis(),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
});