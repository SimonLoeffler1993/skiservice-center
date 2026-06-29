"use client"

import { serviceListeOptions } from "@/hooks/useServiceListeOptions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import AuftragKurzCard from "./AuftragKurzCard";


type SkiAuftragListeProps = {
    saisonID: number;
}

export default function AuftragListe({ saisonID }: SkiAuftragListeProps) {
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(serviceListeOptions(saisonID));

    // Infiniti Scroll
    const { ref, inView } = useInView()

    const items = data?.pages.flat().filter((item) => item !== null) ?? []

    // Automatisch die nächste Seite laden, wenn der Benutzer das Ende der Liste erreicht
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <>
            <Badge variant="secondary">{hasNextPage ? "Es sind noch nicht alle Service geladen" : "Alle Service geladen"}</Badge>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((skiAuftrag) => (
                    <AuftragKurzCard key={skiAuftrag.id} skiserviceAuftrag={skiAuftrag} />
                ))}
            </div>
            <div>
                {isFetchingNextPage && <p>Weitere Daten werden geladen...</p>}
            </div>
            <div ref={ref} />
        </>
    )
}