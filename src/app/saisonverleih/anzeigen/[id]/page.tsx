import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import SaisonverleihAnzeigeUebersicht from "@/components/saisonverleih/anzeige/Uebersicht";
import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";

export default async function SaisonverleihAnzeigen({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // const data = getSaisonVerleihById(id);
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(saisonverleihDetailsOptions(Number(id)));
   
    // React Query umbauen auf hydration

    return (
        <div className="container mx-auto p-4 space-y-6">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SaisonverleihAnzeigeUebersicht saisonverleihID={Number(id)} />
            </HydrationBoundary>
        </div>
    );
}   