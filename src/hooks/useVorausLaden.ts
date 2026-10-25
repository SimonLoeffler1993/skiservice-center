"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type VorausLadenProps<T> = {
    // Seiten aus useInfiniteQuery (null = Seite konnte nicht geladen werden)
    seiten: (T[] | null)[] | undefined;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => unknown;
};

/**
 * Infinite Scroll mit Puffer: Es ist immer eine Seite mehr geladen als angezeigt.
 * Kommt das Listenende in Sichtweite, erscheint die gepufferte Seite sofort und
 * im Hintergrund wird die nächste geholt. So entsteht beim Scrollen keine Ladepause.
 */
export function useVorausLaden<T>({ seiten = [], hasNextPage, isFetchingNextPage, fetchNextPage }: VorausLadenProps<T>) {
    const [angezeigteSeiten, setAngezeigteSeiten] = useState(1);
    // Schon deutlich vor dem Ende auslösen
    const { ref, inView } = useInView({ rootMargin: "800px 0px" });
    const geladen = seiten.length;

    // Puffer auffüllen: eine Seite mehr laden als angezeigt
    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage && geladen <= angezeigteSeiten) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, geladen, angezeigteSeiten, fetchNextPage]);

    // Ende in Sicht: gepufferte Seite sofort anzeigen (State-Anpassung beim Rendern statt im Effekt)
    if (inView && geladen > angezeigteSeiten) {
        setAngezeigteSeiten(angezeigteSeiten + 1);
    }

    // Ohne weitere Seiten alles Geladene anzeigen
    const sichtbar = hasNextPage ? seiten.slice(0, angezeigteSeiten) : seiten;
    const items = sichtbar.flat().filter((item): item is T => item !== null);

    return {
        items,
        ref,
        // Nur wenn man am Ende angekommen ist und der Puffer noch lädt
        laedt: inView && hasNextPage && geladen <= angezeigteSeiten,
        alleGeladen: !hasNextPage,
    };
}
