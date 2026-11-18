"use client"

import { useInfiniteQuery } from "@tanstack/react-query";
import { Wrench } from "lucide-react";

import ListenKopf from "@/components/liste/ListenKopf";
import { LISTEN_RASTER, ListenFuss, ListenLeer, ListenSkeleton } from "@/components/liste/ListenTeile";
import { serviceListeOptions } from "@/hooks/useServiceListeOptions";
import { useVorausLaden } from "@/hooks/useVorausLaden";
import { ListenSortierung } from "@/types/liste";
import { ServiceListenFilter } from "@/types/skiservicetypes";
import AuftragKurzCard from "./AuftragKurzCard";

type SkiAuftragListeProps = {
    saisonID: number;
    sortierung: ListenSortierung;
    // Suche nach dem Kundennamen, leer = alle
    suche: string;
    // Status, Bezahlt, Benachrichtigt, Erledigte ausblenden
    listenFilter: ServiceListenFilter;
    // Filter (Saison, Sortierung, Suche, weitere) für den Kopf
    filter: React.ReactNode;
}

export default function AuftragListe({ saisonID, sortierung, suche, listenFilter, filter }: SkiAuftragListeProps) {
    const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(serviceListeOptions(saisonID, sortierung, suche, listenFilter));
    // Das Ausblenden der erledigten ist der Standard und zählt nicht als gesetzter Filter
    const { erledigte, ...gesetzteFilter } = listenFilter;
    const gefiltert = Object.values(gesetzteFilter).some(Boolean);
    const keineText = erledigte ? "Keine offenen Aufträge in dieser Saison" : "Keine Aufträge in dieser Saison";
    // Immer eine Seite voraus laden, damit das Scrollen ohne Pause läuft
    const { items, ref, laedt, alleGeladen } = useVorausLaden({ seiten: data?.pages, hasNextPage, isFetchingNextPage, fetchNextPage, neuBeginnenBei: suche });

    return (
        <section className="space-y-5">
            <ListenKopf
                titel="Skiservice"
                icon={Wrench}
                unterzeile={isPending ? "Aufträge werden geladen..." : `${items.length}${alleGeladen ? "" : "+"} Aufträge`}
                neuHref="/skiservice/erstellen"
                neuText="Neuer Auftrag"
            >
                {filter}
            </ListenKopf>

            {isPending ? (
                <ListenSkeleton />
            ) : items.length === 0 ? (
                <ListenLeer icon={Wrench} titel={suche ? `Keine Treffer für „${suche}“` : gefiltert ? "Keine Aufträge passend zum Filter" : keineText} neuHref="/skiservice/erstellen" neuText="Neuer Auftrag" />
            ) : (
                <div className={LISTEN_RASTER}>
                    {items.map((skiAuftrag) => (
                        <AuftragKurzCard key={skiAuftrag.id} skiserviceAuftrag={skiAuftrag} />
                    ))}
                </div>
            )}
            <ListenFuss sentinel={ref} laedt={laedt} alleGeladen={alleGeladen} anzahl={items.length} einheit="Aufträge" />
        </section>
    )
}
