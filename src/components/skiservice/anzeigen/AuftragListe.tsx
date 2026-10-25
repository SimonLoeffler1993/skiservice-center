"use client"

import { useInfiniteQuery } from "@tanstack/react-query";
import { Wrench } from "lucide-react";

import ListenKopf from "@/components/liste/ListenKopf";
import { LISTEN_RASTER, ListenFuss, ListenLeer, ListenSkeleton } from "@/components/liste/ListenTeile";
import { serviceListeOptions } from "@/hooks/useServiceListeOptions";
import { useVorausLaden } from "@/hooks/useVorausLaden";
import AuftragKurzCard from "./AuftragKurzCard";

type SkiAuftragListeProps = {
    saisonID: number;
    // Filter (Saison) für den Kopf
    filter: React.ReactNode;
}

export default function AuftragListe({ saisonID, filter }: SkiAuftragListeProps) {
    const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(serviceListeOptions(saisonID));
    // Immer eine Seite voraus laden, damit das Scrollen ohne Pause läuft
    const { items, ref, laedt, alleGeladen } = useVorausLaden({ seiten: data?.pages, hasNextPage, isFetchingNextPage, fetchNextPage });

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
                <ListenLeer icon={Wrench} titel="Keine Aufträge in dieser Saison" neuHref="/skiservice/erstellen" neuText="Neuer Auftrag" />
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
