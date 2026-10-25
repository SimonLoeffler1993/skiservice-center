
import SkiserviceAnzeigenAuftragDetails from "@/components/skiservice/anzeigen/AuftragDetails";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function SkiserviceAuftragAnzeigen({ params, searchParams }: {
    params: Promise<{ id: string }>;
    // ?ski=ID aus dem QR-Code des Etiketts
    searchParams: Promise<{ ski?: string }>;
}){
    const { id } = await params;
    const { ski } = await searchParams;
    const queryClient = new QueryClient
    // Params sind immer String darum Number
    await queryClient.prefetchQuery(auftragDetailsOptions(Number(id)))

    return(
        <div className="container mx-auto p-4 space-y-6">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SkiserviceAnzeigenAuftragDetails skiserviceAuftragID={Number(id)} hervorheben={ski ? Number(ski) : undefined} />
            </HydrationBoundary>
        </div>
    )
}