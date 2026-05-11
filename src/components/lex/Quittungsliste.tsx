import { RefObject, useCallback, useEffect, useRef } from "react";
import { lexBeelegeListInfiniteOptions } from "@/hooks/useLexBelegeListeOptions";
import { useInfiniteQuery } from "@tanstack/react-query";
import BelegCard from "./BelegCard";

type QuittungslisteProps = {
    scrollContainerRef: RefObject<HTMLDivElement | null>;
};

export default function Quittungsliste({ scrollContainerRef }: QuittungslisteProps) {
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfiniteQuery(lexBeelegeListInfiniteOptions());

    // Da useInView nicht mit einem externen Scroll-Container funktioniert, nutzen wir einen IntersectionObserver auf einem Sentinel-Element am Ende der Liste.
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Callback-Ref: wird aufgerufen sobald das Sentinel-Element im DOM ist
    const sentinelRef = useCallback((node: HTMLDivElement | null) => {
        if (!node || !scrollContainerRef.current) return;

        // Alten Observer aufräumen
        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            {
                root: scrollContainerRef.current, // <-- der Dialog-Scroll-Container
                threshold: 0.1,
            }
        );

        observerRef.current.observe(node);
    }, [hasNextPage, fetchNextPage, scrollContainerRef]);

    // Observer aufräumen beim Unmount
    useEffect(() => {
        return () => observerRef.current?.disconnect();
    }, []);

    const belegeListe =
        data?.pages
            .flatMap((page) => page?.content ?? [])
            .filter((item) => item !== null) ?? [];

    return (
        <>
            <p>Quittungsliste</p>
            <div className="flex flex-col gap-2">
                {belegeListe.map((beleg) => (
                    <BelegCard key={beleg.id} beleg={beleg} />
                ))}
            </div>
            {isFetchingNextPage && <p>Weitere Daten werden geladen...</p>}

            {/* Sentinel – Callback-Ref registriert den Observer sobald das Element existiert */}
            <div ref={sentinelRef} className="h-1" />
        </>
    );
}