import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import WerkstattDashboard from "@/components/werkstatt/WerkstattDashboard";
import { werkstattOptions } from "@/hooks/useWerkstattOptions";

export default async function WerkstattSeite() {
    // Schon auf dem Server laden, damit die Seite sofort mit Daten erscheint.
    // Ein Fehler wird nicht übernommen, der Browser lädt dann selbst und zeigt ihn an
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(werkstattOptions);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WerkstattDashboard />
        </HydrationBoundary>
    );
}
