import SaisonverleihListe from "@/components/saisonverleih/liste/SaisonverleihListe";
import { Snowflake } from "lucide-react";
import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { saisonverleihListOptions } from "@/hooks/useSaisonverleihListeOptions";
import { getSaisonDaten } from "@/lib/saisonactions";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import { Suspense } from "react";
import VerleihArtFilter from "@/components/saisonverleih/liste/VerleihArtFilter";
import { VerleihArtSchema } from "@/types/saisonverleihtypes";

type SaisonVerleiAnzeigeProps = {
    searchParams: Promise<{ saison?: string; art?: string }>
}

export default async function SaisonVerleiAnzeige({searchParams}: SaisonVerleiAnzeigeProps) {
    
    // Saisons kommen aus dem Server Cache
    const saisonDaten = await getSaisonDaten();
    if (!saisonDaten.success) {
        return <BackendFehler meldung={saisonDaten.error} />
    }
    const saisonsData = saisonDaten.data.saisons;

    // Saison aus URL, falls nicht vorhanden wird die aktuelle verwendet
    const { saison, art: artParameter } = await searchParams;
    // Filter nach Art, ungültige Werte gelten als "alle"
    const art = VerleihArtSchema.safeParse(artParameter).data;
    const saisonID = saison ? parseInt(saison) : saisonDaten.data.aktuelle?.ID;

    // Fehler falls keine Saison gibt
    if (!saisonID || Number.isNaN(saisonID)) {
        return <KeineSaison />
    }

    // Prefetch SaisonverleihListe Daten für die ausgewählte Saison
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(saisonverleihListOptions(saisonID, art));

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">   
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-xl font-semibold">Verleih</h1>
                </div>
            </div>
            <Suspense fallback={<div>Lade Saisons...</div>}>
                <div className="flex flex-wrap items-center gap-4">
                    <SaisonWechseler saisons={saisonsData} selectedSaisonID={saisonID}/>
                    <VerleihArtFilter art={art} />
                </div>
            </Suspense>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SaisonverleihListe saisonID={saisonID} art={art}/>
            </HydrationBoundary>
        </section>
    )
}