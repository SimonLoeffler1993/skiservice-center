import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { z } from "zod";

import WerkstattDashboard from "@/components/werkstatt/WerkstattDashboard";
import { MAX_SEKUNDEN, MIN_SEKUNDEN, STANDARD_SEKUNDEN, WerkstattAnsichtSchema } from "@/components/werkstatt/werkstattUrl";
import { werkstattOptions } from "@/hooks/useWerkstattOptions";

type WerkstattSeiteProps = {
    // ansicht: service | verleih, auto=1: automatisch wechseln, sekunden: Dauer je Ansicht
    searchParams: Promise<{ ansicht?: string; auto?: string; sekunden?: string }>
}

export default async function WerkstattSeite({ searchParams }: WerkstattSeiteProps) {
    const parameter = await searchParams;
    const ansicht = WerkstattAnsichtSchema.safeParse(parameter.ansicht).data ?? "service";
    const auto = parameter.auto === "1";
    // Ungültig: Standard, sonst auf den erlaubten Bereich begrenzt
    const gelesen = z.coerce.number().int().safeParse(parameter.sekunden).data;
    const sekunden = gelesen === undefined || parameter.sekunden === undefined
        ? STANDARD_SEKUNDEN
        : Math.min(MAX_SEKUNDEN, Math.max(MIN_SEKUNDEN, gelesen));

    // Schon auf dem Server laden, damit die Seite sofort mit Daten erscheint.
    // Ein Fehler wird nicht übernommen, der Browser lädt dann selbst und zeigt ihn an
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(werkstattOptions);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WerkstattDashboard ansicht={ansicht} auto={auto} sekunden={sekunden} />
        </HydrationBoundary>
    );
}
