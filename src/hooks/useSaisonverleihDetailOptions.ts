import { queryOptions } from "@tanstack/react-query";

import { getSaisonVerleihById } from "@/lib/saisonverleihactions";


export const saisonverleihDetailsOptions = (saisonverleihID: number) => queryOptions({
    queryKey: ["saisonverleihDetails", saisonverleihID],
    queryFn: () => getSaisonVerleihById(saisonverleihID),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
});