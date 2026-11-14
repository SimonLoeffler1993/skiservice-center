import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import SkiDetails from "@/components/material/detail/SkiDetails";
import { skiDetailsOptions } from "@/hooks/useMaterialDetailOptions";
import { getSaisonDaten } from "@/lib/saisonactions";

type SkiSeiteProps = {
    params: Promise<{ id: string }>
}

export default async function SkiSeite({ params }: SkiSeiteProps) {
    const skiID = Number((await params).id);
    if (!Number.isInteger(skiID) || skiID <= 0) notFound();

    // Schon auf dem Server laden, damit die Seite sofort mit Daten erscheint.
    // Ein Fehler wird nicht übernommen, der Browser lädt dann selbst und zeigt ihn an
    const queryClient = new QueryClient();
    const [saisonDaten] = await Promise.all([
        getSaisonDaten(),
        queryClient.prefetchQuery(skiDetailsOptions(skiID)),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* Saisons nur für die Überschriften, ohne sie steht dort die Saison-Nummer */}
            <SkiDetails skiID={skiID} saisons={saisonDaten.success ? saisonDaten.data.saisons : []} />
        </HydrationBoundary>
    );
}
