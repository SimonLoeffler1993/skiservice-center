import ListenSortierung from "@/components/liste/ListenSortierung";
import ListenSuche from "@/components/liste/ListenSuche";
import SaisonverleihListe from "@/components/saisonverleih/liste/SaisonverleihListe";
import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { saisonverleihListOptions } from "@/hooks/useSaisonverleihListeOptions";
import { getSaisonDaten } from "@/lib/saisonactions";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import { Suspense } from "react";
import VerleihArtFilter from "@/components/saisonverleih/liste/VerleihArtFilter";
import { JaNeinSchema, ListenSortierungSchema } from "@/types/liste";
import ListenFilter from "@/components/liste/ListenFilter";
import { VerleihArtSchema, VerleihBenachrichtigungSchema, VerleihListenFilter, VerleihStatusSchema } from "@/types/saisonverleihtypes";

type SaisonVerleiAnzeigeProps = {
    searchParams: Promise<{ saison?: string; art?: string; sortierung?: string; suche?: string; status?: string; bezahlt?: string; benachrichtigt?: string }>
}

export default async function SaisonVerleiAnzeige({searchParams}: SaisonVerleiAnzeigeProps) {
    
    // Saisons kommen aus dem Server Cache
    const saisonDaten = await getSaisonDaten();
    if (!saisonDaten.success) {
        return <BackendFehler meldung={saisonDaten.error} />
    }
    const saisonsData = saisonDaten.data.saisons;

    // Saison aus URL, falls nicht vorhanden wird die aktuelle verwendet
    const { saison, art: artParameter, sortierung: sortierungParameter, suche: sucheParameter, ...filterParameter } = await searchParams;
    // Ungültige Sortierung gilt als Standard
    const sortierung = ListenSortierungSchema.safeParse(sortierungParameter).data ?? "aelteste";
    const suche = typeof sucheParameter === "string" ? sucheParameter.trim().slice(0, 100) : "";
    // Filter nach Art, ungültige Werte gelten als "alle"
    const art = VerleihArtSchema.safeParse(artParameter).data;
    // Weitere Filter, ungültige Werte gelten als "alle"
    const listenFilter: VerleihListenFilter = {
        status: VerleihStatusSchema.safeParse(filterParameter.status).data,
        bezahlt: JaNeinSchema.safeParse(filterParameter.bezahlt).data,
        benachrichtigt: VerleihBenachrichtigungSchema.safeParse(filterParameter.benachrichtigt).data,
    };
    const saisonID = saison ? parseInt(saison) : saisonDaten.data.aktuelle?.ID;

    // Fehler falls keine Saison gibt
    if (!saisonID || Number.isNaN(saisonID)) {
        return <KeineSaison />
    }

    // Prefetch SaisonverleihListe Daten für die ausgewählte Saison
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(saisonverleihListOptions(saisonID, art, sortierung, suche, listenFilter));

    // Neu einhängen bei Saison-, Art-, Sortierungs- oder Filterwechsel, damit das Vorausladen wieder bei Seite 1 beginnt.
    // Nicht bei der Suche, sonst verliert das Eingabefeld beim Tippen den Fokus
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SaisonverleihListe
                key={`${saisonID}-${art ?? "alle"}-${sortierung}-${listenFilter.status}-${listenFilter.bezahlt}-${listenFilter.benachrichtigt}`}
                saisonID={saisonID}
                art={art}
                sortierung={sortierung}
                suche={suche}
                listenFilter={listenFilter}
                filter={
                    <Suspense fallback={null}>
                        <SaisonWechseler saisons={saisonsData} selectedSaisonID={saisonID} />
                        <VerleihArtFilter art={art} />
                        <ListenSortierung sortierung={sortierung} standard="aelteste" />
                        <ListenFilter
                            gruppen={[
                                {
                                    parameter: "status",
                                    titel: "Status",
                                    wert: listenFilter.status,
                                    optionen: [
                                        { wert: "vorbereitung", text: "In Vorbereitung" },
                                        { wert: "vorbereitet", text: "Vorbereitet" },
                                        { wert: "unterwegs", text: "Unterwegs" },
                                        { wert: "zurueck", text: "Zurückgegeben" },
                                    ],
                                },
                                {
                                    parameter: "bezahlt",
                                    titel: "Bezahlt",
                                    wert: listenFilter.bezahlt,
                                    optionen: [
                                        { wert: "ja", text: "Ja" },
                                        { wert: "nein", text: "Nein" },
                                    ],
                                },
                                {
                                    parameter: "benachrichtigt",
                                    titel: "Benachrichtigt",
                                    wert: listenFilter.benachrichtigt,
                                    optionen: [
                                        { wert: "nein", text: "Nein" },
                                        { wert: "abholung", text: "Zur Abholung" },
                                        { wert: "rueckgabe", text: "Zur Rückgabe" },
                                    ],
                                },
                            ]}
                        />
                        <ListenSuche suche={suche} />
                    </Suspense>
                }
            />
        </HydrationBoundary>
    )
}
