import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import AuftragListe from "@/components/skiservice/anzeigen/AuftragListe";
import { serviceListeOptions } from "@/hooks/useServiceListeOptions";
import { getSaisonDaten } from "@/lib/saisonactions";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Snowflake } from "lucide-react";
import { Suspense } from "react";

type SkiservicesAnzeigenProps = {
    searchParams: Promise<{ saison?: string }>
}

export default async function SkiservicesAnzeigen({ searchParams }: SkiservicesAnzeigenProps) {

    // Saisons kommen aus dem Server Cache
    const saisonDaten = await getSaisonDaten();
    if (!saisonDaten.success) {
        return <BackendFehler meldung={saisonDaten.error} />
    }
    const saisonData = saisonDaten.data.saisons;

    // Saison aus URL, falls nicht vorhanden wird die aktuelle verwendet
    const { saison } = await searchParams;
    const saisonID = saison ? parseInt(saison) : saisonDaten.data.aktuelle?.ID;

    // Fehler falls keine Saison gibt
    if (!saisonID || Number.isNaN(saisonID)) {
        return <KeineSaison />
    }

    // Service in Cache laden
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(serviceListeOptions(saisonID))

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-xl font-semibold">Skiservice</h1>
                </div>
            </div>
            <Suspense fallback={<div>Lade Skiservices ...</div>}>
                <SaisonWechseler saisons={saisonData} selectedSaisonID={saisonID} />
            </Suspense>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AuftragListe saisonID={saisonID} />
            </HydrationBoundary>
        </section>
    )
}