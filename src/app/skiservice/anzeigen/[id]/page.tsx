
import SkiserviceAnzeigenAuftragDetails from "@/components/skiservice/anzeigen/AuftragDetails";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function SkiserviceAuftragAnzeigen({ params }: { params: Promise<{ id: string }> }){
    const { id } = await params;
    const queryClient = new QueryClient
    // Params sind immer String darum Number
    await queryClient.prefetchQuery(auftragDetailsOptions(Number(id)))

    return(
        <div className="container mx-auto p-4 space-y-6">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SkiserviceAnzeigenAuftragDetails skiserviceAuftragID={Number(id)} />
            </HydrationBoundary>
        </div>
    )
}