import SaisonverleihListe from "@/components/saisonverleih/liste/SaisonverleihListe";
import { Snowflake } from "lucide-react";
import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { saisonverleihListOptions } from "@/hooks/useSaisonverleihListeOptions";
import { getAktuelleSaisonID, getSaisons } from "@/lib/saisonactions";
import { Suspense } from "react";

export default async function SaisonVerleiAnzeige({searchParams}: {searchParams: Promise<{ saison?: string }>}) {
    
    // Daten für SaisonWechseler laden
    const saisonsData = await getSaisons();
    const { saison } = await searchParams;

    // Saison aus URL oder aktuelle Saison ermitteln
    let saisonID: number | undefined;

    if (!saison) {
        const aktuelleSaison = await getAktuelleSaisonID()
        if (aktuelleSaison) {
            saisonID = aktuelleSaison.ID;
        }
    }else {
        saisonID = parseInt(saison);
        console.log("Saison aus URL:", saisonID);
    }

    // Falls gar keine Saison gefunden wurde
    if (!saisonID) {
        return <p>Keine Saison gefunden</p>;
    }

    // Prefetch SaisonverleihListe Daten für die ausgewählte Saison
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(saisonverleihListOptions(saisonID!));

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
            <Suspense fallback={<div>Lade Saisons...</div>}>
                <SaisonWechseler saisons={saisonsData} selectedSaisonID={saisonID}/>
            </Suspense>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SaisonverleihListe saisonID={saisonID}/>
            </HydrationBoundary>
        </section>
    )
}