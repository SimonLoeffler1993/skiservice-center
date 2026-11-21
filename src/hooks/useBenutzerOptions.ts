import { queryOptions } from "@tanstack/react-query";

import { holeBenutzer } from "@/lib/benutzeractions";
import { holeGruppen, holeRechteKatalog, holeRollen } from "@/lib/rechteactions";
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

export const rollenOptions = queryOptions({
    queryKey: ["rollen"],
    queryFn: () => holeRollen(),
    staleTime: 0,
});

export const gruppenOptions = queryOptions({
    queryKey: ["gruppen"],
    queryFn: () => holeGruppen(),
    staleTime: 0,
});

// Die Rechteliste ist fest im Code der API
export const rechteKatalogOptions = queryOptions({
    queryKey: ["rechteKatalog"],
    queryFn: () => holeRechteKatalog(),
    staleTime: Infinity,
});
