import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import SaisonverleihAnzeigeUebersicht from "@/components/saisonverleih/anzeige/Uebersicht";
import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";
import { quittungOptions } from "@/hooks/useQuittungOptions";

export default async function SaisonverleihAnzeigen({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // const data = getSaisonVerleihById(id);
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(saisonverleihDetailsOptions(Number(id)));
   
    // Erst die Saisonverleih-Daten holen, um die QuittungID zu bekommen
    const saisonverleihData = queryClient.getQueryData(saisonverleihDetailsOptions(Number(id)).queryKey);
    if (saisonverleihData?.QuittungID) {
        await queryClient.prefetchQuery(quittungOptions(saisonverleihData.QuittungID));
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SaisonverleihAnzeigeUebersicht saisonverleihID={Number(id)} />
            </HydrationBoundary>
        </div>
    );
}   