"use client"

import { useInView } from "react-intersection-observer";
import SaisonverleihListeCard from "./SaisonverleihListeCard";
import { Badge } from "@/components/ui/badge";
import { useInfiniteQuery } from "@tanstack/react-query";
import { saisonverleihListOptions } from "@/hooks/useSaisonverleihListeOptions";
import { useEffect } from "react";

type SaisonverleihListeProps = {
    saisonID: number;
}


export default function SaisonverleihListe({ saisonID }: SaisonverleihListeProps) {
    const {data, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(saisonverleihListOptions(saisonID));
    // console.log("SaisonverleihListe data:", data);

    const { ref, inView } = useInView();
    

    // if (!saisonverleihliste) {
    //     return <p>Saisonverleihliste nicht gefunden</p>;
    // }

    const items = data?.pages.flat().filter((item) => item !== null) ?? []

    // Auto Nachladen, sobald die Daten geladen sind.
    useEffect(() => {
        if (data && data.pages.length > 0 && hasNextPage) {
            fetchNextPage();
        }
    }, [data, hasNextPage, fetchNextPage]);

    // Automatisch die nächste Seite laden, wenn der Benutzer das Ende der Liste erreicht
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
    
    return (
        <>
            
            <Badge variant="secondary">gefunden: {items.length}</Badge>
            {/* {!hasNextPage && (
                <Badge variant="secondary">Alle Saisonverleih-Datensätze geladen</Badge>
            )} */}
            <Badge variant="secondary">{hasNextPage ? "Es sind noch nicht alle geladen" : "Alle Saisonverleih-Datensätze geladen"}</Badge>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((saisonverleih) => (
                    <SaisonverleihListeCard key={saisonverleih.ID} saisonverleih={saisonverleih} />
                ))}
            </div>
            <div>
                {isFetchingNextPage &&<p>Weitere Daten werden geladen...</p>}
            </div>
            <div ref={ref} />
        </>
    );
}