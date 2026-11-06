import ListenSortierung from "@/components/liste/ListenSortierung";
import ListenSuche from "@/components/liste/ListenSuche";
import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import AuftragListe from "@/components/skiservice/anzeigen/AuftragListe";
import { serviceListeOptions } from "@/hooks/useServiceListeOptions";
import { getSaisonDaten } from "@/lib/saisonactions";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { ListenSortierungSchema } from "@/types/liste";

type SkiservicesAnzeigenProps = {
    searchParams: Promise<{ saison?: string; sortierung?: string; suche?: string }>
}

export default async function SkiservicesAnzeigen({ searchParams }: SkiservicesAnzeigenProps) {

    // Saisons kommen aus dem Server Cache
    const saisonDaten = await getSaisonDaten();
    if (!saisonDaten.success) {
        return <BackendFehler meldung={saisonDaten.error} />
    }
    const saisonData = saisonDaten.data.saisons;

    // Saison aus URL, falls nicht vorhanden wird die aktuelle verwendet
    const { saison, sortierung: sortierungParameter, suche: sucheParameter } = await searchParams;
    // Ungültige Sortierung gilt als Standard
    const sortierung = ListenSortierungSchema.safeParse(sortierungParameter).data ?? "neueste";
    const suche = typeof sucheParameter === "string" ? sucheParameter.trim().slice(0, 100) : "";
    const saisonID = saison ? parseInt(saison) : saisonDaten.data.aktuelle?.ID;

    // Fehler falls keine Saison gibt
    if (!saisonID || Number.isNaN(saisonID)) {
        return <KeineSaison />
    }

    // Service in Cache laden
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(serviceListeOptions(saisonID, sortierung, suche))

    // Neu einhängen bei Saison- oder Sortierungswechsel, damit das Vorausladen wieder bei Seite 1 beginnt.
    // Nicht bei der Suche, sonst verliert das Eingabefeld beim Tippen den Fokus
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AuftragListe
                key={`${saisonID}-${sortierung}`}
                saisonID={saisonID}
                sortierung={sortierung}
                suche={suche}
                filter={
                    <Suspense fallback={null}>
                        <SaisonWechseler saisons={saisonData} selectedSaisonID={saisonID} />
                        <ListenSortierung sortierung={sortierung} standard="neueste" />
                        <ListenSuche suche={suche} />
                    </Suspense>
                }
            />
        </HydrationBoundary>
    )
}
