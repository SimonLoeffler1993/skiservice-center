import SaisonverleihListe from "@/components/saisonverleih/liste/SaisonverleihListe";
import { Snowflake } from "lucide-react";
// import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { saisonverleihListOptions } from "@/hooks/useSaisonverleihListeOptions";

export default async function SaisonVerleiAnzeige() {
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(saisonverleihListOptions());


    // TODO Menuleiste
    // TODO Saison wechseln (SaisonWechseler)
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">   
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-xl font-semibold">Saisonverleih</h1>
                </div>
            </div>
            {/* <SaisonWechseler /> */}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SaisonverleihListe />
            </HydrationBoundary>
        </section>
    )
}