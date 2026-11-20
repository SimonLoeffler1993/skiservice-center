import { queryOptions } from "@tanstack/react-query";

import { holeBenutzer } from "@/lib/benutzeractions";
import { holeGeraeteschluessel, holeGeraetesitzungen } from "@/lib/geraeteactions";

export const benutzerOptions = queryOptions({
    queryKey: ["benutzer"],
    queryFn: () => holeBenutzer(),
    staleTime: 0,
});

export const geraeteschluesselOptions = queryOptions({
    queryKey: ["geraete", "schluessel"],
    queryFn: () => holeGeraeteschluessel(),
    staleTime: 0,
});

export const geraetesitzungenOptions = queryOptions({
    queryKey: ["geraete", "sitzungen"],
    queryFn: () => holeGeraetesitzungen(),
    staleTime: 0,
});
