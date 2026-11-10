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
import { JaNeinSchema, ListenSortierungSchema } from "@/types/liste";
import ListenFilter from "@/components/liste/ListenFilter";
import { AuftragStatusFilterSchema, ServiceListenFilter } from "@/types/skiservicetypes";

const JA_NEIN = [
    { wert: "ja", text: "Ja" },
    { wert: "nein", text: "Nein" },
];

type SkiservicesAnzeigenProps = {
    searchParams: Promise<{ saison?: string; sortierung?: string; suche?: string; status?: string; bezahlt?: string; benachrichtigt?: string }>
}

export default async function SkiservicesAnzeigen({ searchParams }: SkiservicesAnzeigenProps) {

    // Saisons kommen aus dem Server Cache
    const saisonDaten = await getSaisonDaten();
    if (!saisonDaten.success) {
        return <BackendFehler meldung={saisonDaten.error} />
    }
    const saisonData = saisonDaten.data.saisons;

    // Saison aus URL, falls nicht vorhanden wird die aktuelle verwendet
    const { saison, sortierung: sortierungParameter, suche: sucheParameter, ...filterParameter } = await searchParams;
    // Ungültige Sortierung gilt als Standard
    const sortierung = ListenSortierungSchema.safeParse(sortierungParameter).data ?? "neueste";
    const suche = typeof sucheParameter === "string" ? sucheParameter.trim().slice(0, 100) : "";
    // Weitere Filter, ungültige Werte gelten als "alle"
    const listenFilter: ServiceListenFilter = {
        status: AuftragStatusFilterSchema.safeParse(filterParameter.status).data,
        bezahlt: JaNeinSchema.safeParse(filterParameter.bezahlt).data,
        benachrichtigt: JaNeinSchema.safeParse(filterParameter.benachrichtigt).data,
    };
    const saisonID = saison ? parseInt(saison) : saisonDaten.data.aktuelle?.ID;

    // Fehler falls keine Saison gibt
    if (!saisonID || Number.isNaN(saisonID)) {
        return <KeineSaison />
    }

    // Service in Cache laden
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(serviceListeOptions(saisonID, sortierung, suche, listenFilter))

    // Neu einhängen bei Saison-, Sortierungs- oder Filterwechsel, damit das Vorausladen wieder bei Seite 1 beginnt.
    // Nicht bei der Suche, sonst verliert das Eingabefeld beim Tippen den Fokus
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AuftragListe
                key={`${saisonID}-${sortierung}-${listenFilter.status}-${listenFilter.bezahlt}-${listenFilter.benachrichtigt}`}
                saisonID={saisonID}
                sortierung={sortierung}
                suche={suche}
                listenFilter={listenFilter}
                filter={
                    <Suspense fallback={null}>
                        <SaisonWechseler saisons={saisonData} selectedSaisonID={saisonID} />
                        <ListenSortierung sortierung={sortierung} standard="neueste" />
                        <ListenFilter
                            gruppen={[
                                {
                                    parameter: "status",
                                    titel: "Status",
                                    wert: listenFilter.status,
                                    optionen: [
                                        { wert: "bearbeitung", text: "In Bearbeitung" },
                                        { wert: "fertig", text: "Fertig" },
                                        { wert: "abgeholt", text: "Abgeholt" },
                                    ],
                                },
                                { parameter: "bezahlt", titel: "Bezahlt", wert: listenFilter.bezahlt, optionen: JA_NEIN },
                                { parameter: "benachrichtigt", titel: "Benachrichtigt", wert: listenFilter.benachrichtigt, optionen: JA_NEIN },
                            ]}
                        />
                        <ListenSuche suche={suche} />
                    </Suspense>
                }
            />
        </HydrationBoundary>
    )
}
