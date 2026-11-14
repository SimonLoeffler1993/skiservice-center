import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import SchuhDetails from "@/components/material/detail/SchuhDetails";
import { schuhDetailsOptions } from "@/hooks/useMaterialDetailOptions";
import { getSaisonDaten } from "@/lib/saisonactions";

type SchuhSeiteProps = {
    params: Promise<{ id: string }>
}

export default async function SchuhSeite({ params }: SchuhSeiteProps) {
    const schuhID = Number((await params).id);
    if (!Number.isInteger(schuhID) || schuhID <= 0) notFound();

    // Schon auf dem Server laden, damit die Seite sofort mit Daten erscheint.
    // Ein Fehler wird nicht übernommen, der Browser lädt dann selbst und zeigt ihn an
    const queryClient = new QueryClient();
    const [saisonDaten] = await Promise.all([
        getSaisonDaten(),
        queryClient.prefetchQuery(schuhDetailsOptions(schuhID)),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* Saisons nur für die Überschriften, ohne sie steht dort die Saison-Nummer */}
            <SchuhDetails schuhID={schuhID} saisons={saisonDaten.success ? saisonDaten.data.saisons : []} />
        </HydrationBoundary>
    );
}
