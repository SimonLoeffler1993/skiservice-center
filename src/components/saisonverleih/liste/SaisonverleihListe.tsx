"use client"

import { useInfiniteQuery } from "@tanstack/react-query";
import { CalendarDays, Snowflake } from "lucide-react";

import ListenKopf from "@/components/liste/ListenKopf";
import { LISTEN_RASTER, ListenFuss, ListenLeer, ListenSkeleton } from "@/components/liste/ListenTeile";
import { saisonverleihListOptions } from "@/hooks/useSaisonverleihListeOptions";
import { useVorausLaden } from "@/hooks/useVorausLaden";
import { ListenSortierung } from "@/types/liste";
import { VerleihArt, VerleihListenFilter } from "@/types/saisonverleihtypes";
import SaisonverleihListeCard from "./SaisonverleihListeCard";

type SaisonverleihListeProps = {
    saisonID: number;
    art?: VerleihArt;
    sortierung: ListenSortierung;
    // Suche nach dem Kundennamen, leer = alle
    suche: string;
    // Status, Bezahlt, Benachrichtigt
    listenFilter: VerleihListenFilter;
    // Filter (Saison, Art, Sortierung, Suche, weitere) für den Kopf
    filter: React.ReactNode;
}

// Titel und Neu-Link passend zur gewählten Art
const KOPF: Record<VerleihArt | "alle", { titel: string; neuHref: string; neuText: string }> = {
    alle: { titel: "Verleih", neuHref: "/saisonverleih/erstellen", neuText: "Neuer Verleih" },
    saison: { titel: "Saisonverleih", neuHref: "/saisonverleih/erstellen", neuText: "Neuer Saisonverleih" },
    tag: { titel: "Tagesverleih", neuHref: "/saisonverleih/erstellen?art=tag", neuText: "Neuer Tagesverleih" },
};

export default function SaisonverleihListe({ saisonID, art, sortierung, suche, listenFilter, filter }: SaisonverleihListeProps) {
    const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(saisonverleihListOptions(saisonID, art, sortierung, suche, listenFilter));
    const gefiltert = Object.values(listenFilter).some(Boolean);
    // Immer eine Seite voraus laden, damit das Scrollen ohne Pause läuft
    const { items, ref, laedt, alleGeladen } = useVorausLaden({ seiten: data?.pages, hasNextPage, isFetchingNextPage, fetchNextPage, neuBeginnenBei: suche });
    const kopf = KOPF[art ?? "alle"];
    const icon = art === "tag" ? CalendarDays : Snowflake;

    return (
        <section className="space-y-5">
            <ListenKopf
                titel={kopf.titel}
                icon={icon}
                unterzeile={isPending ? "Verleihe werden geladen..." : `${items.length}${alleGeladen ? "" : "+"} Verleihe`}
                neuHref={kopf.neuHref}
                neuText={kopf.neuText}
            >
                {filter}
            </ListenKopf>

            {isPending ? (
                <ListenSkeleton />
            ) : items.length === 0 ? (
                <ListenLeer icon={icon} titel={suche ? `Keine Treffer für „${suche}“` : gefiltert ? "Keine Verleihe passend zum Filter" : "Keine Verleihe in dieser Saison"} neuHref={kopf.neuHref} neuText={kopf.neuText} />
            ) : (
                <div className={LISTEN_RASTER}>
                    {items.map((saisonverleih) => (
                        <SaisonverleihListeCard key={saisonverleih.ID} saisonverleih={saisonverleih} />
                    ))}
                </div>
            )}
            <ListenFuss sentinel={ref} laedt={laedt} alleGeladen={alleGeladen} anzahl={items.length} einheit="Verleihe" />
        </section>
    );
}
