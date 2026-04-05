"use client"

import { useInView } from "react-intersection-observer";
import SaisonverleihListeCard from "./SaisonverleihListeCard";
import { Badge } from "@/components/ui/badge";
import { useInfiniteQuery } from "@tanstack/react-query";
import { saisonverleihListOptions } from "@/hooks/useSaisonverleihListeOptions";
import { useEffect } from "react";


export default function SaisonverleihListe() {
    const {data, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(saisonverleihListOptions());
    // console.log("SaisonverleihListe data:", data);

    const { ref, inView } = useInView();

    // if (!saisonverleihliste) {
    //     return <p>Saisonverleihliste nicht gefunden</p>;
    // }

    const items = data?.pages.flat().filter((item) => item !== null) ?? []

    // Automatisch die nächste Seite laden, wenn der Benutzer das Ende der Liste erreicht
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
    
    return (
        <>
            
            <Badge variant="secondary">gefunden: {items.length}</Badge>
            {!hasNextPage && (
                <Badge variant="secondary">Alle Saisonverleih-Datensätze geladen</Badge>
            )}
            {hasNextPage && (
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    Mehr laden
                </button>
            )}

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