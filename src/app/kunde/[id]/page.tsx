import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import KundeDetails from "@/components/kunde/KundeDetails";
import { kundeHistorieOptions, kundeOptions } from "@/hooks/useKundeOptions";
import { getSaisonDaten } from "@/lib/saisonactions";

type KundeSeiteProps = {
    params: Promise<{ id: string }>
}

export default async function KundeSeite({ params }: KundeSeiteProps) {
    const kundeID = Number((await params).id);
    if (!Number.isInteger(kundeID) || kundeID <= 0) notFound();

    // Schon auf dem Server laden, damit die Seite sofort mit Daten erscheint.
    // Ein Fehler wird nicht übernommen, der Browser lädt dann selbst und zeigt ihn an
    const queryClient = new QueryClient();
    const [saisonDaten] = await Promise.all([
        getSaisonDaten(),
        queryClient.prefetchQuery(kundeOptions(kundeID)),
        queryClient.prefetchQuery(kundeHistorieOptions(kundeID)),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* Saisons nur für die Überschriften, ohne sie steht dort die Saison-Nummer */}
            <KundeDetails kundeID={kundeID} saisons={saisonDaten.success ? saisonDaten.data.saisons : []} />
        </HydrationBoundary>
    );
}
