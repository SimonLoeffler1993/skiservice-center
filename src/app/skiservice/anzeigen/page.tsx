import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import AuftragListe from "@/components/skiservice/anzeigen/AuftragListe";
import { serviceListeOptions } from "@/hooks/useServiceListeOptions";
import { getSaisonDaten } from "@/lib/saisonactions";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
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

    // Neu einhängen bei Saisonwechsel, damit das Vorausladen wieder bei Seite 1 beginnt
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AuftragListe
                key={saisonID}
                saisonID={saisonID}
                filter={
                    <Suspense fallback={null}>
                        <SaisonWechseler saisons={saisonData} selectedSaisonID={saisonID} />
                    </Suspense>
                }
            />
        </HydrationBoundary>
    )
}
