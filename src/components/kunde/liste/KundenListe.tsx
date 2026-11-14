"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import KundeErfassenDialog from "@/components/kunde/KundeErfassenDialog";
import KundenTabelle from "@/components/kunde/suche/KundenTabelle";
import LetzteKunden, { LetzteKundenButton, useLetzteKunden } from "@/components/kunde/suche/LetzteKunden";
import ListenSuche from "@/components/liste/ListenSuche";
import Seitenleiste from "@/components/liste/Seitenleiste";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { kundenListeOptions } from "@/hooks/useKundeOptions";
import { cn } from "@/lib/utils";
import { Kunde, KundenSortierung } from "@/types/skikundentypes";
import { KundenAnsicht, kundenUrl } from "./kundenUrl";

const SORTIERUNGEN: { wert: KundenSortierung; text: string; titel: string }[] = [
    { wert: "name", text: "A–Z", titel: "Nach Nachname, Vorname" },
    { wert: "neueste", text: "Neueste", titel: "Zuletzt angelegte oben" },
];

// Bei der Suche fällt die Seite aus der URL, sonst stünde man auf einer Seite, die es nicht mehr gibt
const BEI_SUCHE_ZURUECKSETZEN = ["seite"];

// Kundenbereich: alle Kunden seitenweise, die Suche grenzt die Liste optional ein
export default function KundenListe({ suche, sortierung, seite }: KundenAnsicht) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data, error, isPending, isPlaceholderData } = useQuery(kundenListeOptions(seite, sortierung, suche));
    // Zuletzt angelegte Kunden und Check-ins, z.B. gerade am Kundenterminal erfasst
    const letzteKunden = useLetzteKunden();
    const [letzteOffen, setLetzteOffen] = useState(false);

    function oeffnen(kunde: Kunde) {
        router.push(`/kunde/${kunde.ID}`);
    }

    const gesamt = data?.gesamt ?? 0;
    const seiten = data ? Math.max(1, Math.ceil(data.gesamt / data.proSeite)) : 1;
    const von = data ? (data.seite - 1) * data.proSeite + 1 : 0;
    const bis = data ? Math.min(data.seite * data.proSeite, data.gesamt) : 0;
    const einheit = suche ? "Treffer" : gesamt === 1 ? "Kunde" : "Kunden";

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                {/* useSearchParams in der Suche braucht eine Suspense-Grenze */}
                <Suspense fallback={null}>
                    <ListenSuche suche={suche} zuruecksetzen={BEI_SUCHE_ZURUECKSETZEN} />
                </Suspense>
                <div role="radiogroup" aria-label="Sortierung" className="inline-flex rounded-lg bg-muted p-1">
                    {SORTIERUNGEN.map(({ wert, text, titel }) => (
                        <Link
                            key={wert}
                            href={kundenUrl({ suche, sortierung: wert, seite: 1 })}
                            role="radio"
                            title={titel}
                            aria-checked={sortierung === wert}
                            className={cn(
                                "flex h-8 items-center rounded-md px-4 text-sm font-medium transition-colors",
                                sortierung === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {text}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-wrap gap-3 sm:ml-auto">
                    <KundeErfassenDialog nachname={suche} onGespeichert={oeffnen} beschriftung="Neuer Kunde" buttonClassName="h-10" />
                    <LetzteKundenButton
                        isPending={letzteKunden.isPending}
                        onClick={() => {
                            setLetzteOffen(true);
                            letzteKunden.laden();
                        }}
                    />
                </div>
            </div>

            <LetzteKunden offen={letzteOffen} setOffen={setLetzteOffen} onKundeAuswaehlen={oeffnen} {...letzteKunden} />

            {error && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 p-4">
                    <p className="text-destructive">{error.message}</p>
                    <button type="button" className="text-sm font-medium underline" onClick={() => queryClient.invalidateQueries({ queryKey: ["kundenListe"] })}>
                        Erneut versuchen
                    </button>
                </div>
            )}

            {isPending && (
                <div className="space-y-2">
                    {Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}
                </div>
            )}

            {data && gesamt === 0 && (
                <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-muted-foreground">{suche ? `Kein Kunde gefunden für „${suche}“.` : "Noch keine Kunden vorhanden."}</p>
                    <KundeErfassenDialog nachname={suche} onGespeichert={oeffnen} hervorheben />
                </div>
            )}

            {data && gesamt > 0 && (
                <>
                    {/* Blasser, solange noch die vorherige Seite angezeigt wird */}
                    <Card className={cn("transition-opacity", isPlaceholderData && "opacity-60")}>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h2 className="font-semibold">
                                    {gesamt} {einheit}
                                    {suche && <span className="font-normal text-muted-foreground"> für „{suche}“</span>}
                                </h2>
                                {seiten > 1 && bis >= von && <p className="text-sm text-muted-foreground">{von}–{bis} von {gesamt}</p>}
                            </div>
                            <KundenTabelle kunden={data.eintraege} onAuswaehlen={oeffnen} />
                            {data.uebersprungen > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {data.uebersprungen === 1 ? "1 Kunde auf dieser Seite ist" : `${data.uebersprungen} Kunden auf dieser Seite sind`} wegen fehlerhafter Altdaten nicht lesbar.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                    <Seitenleiste seite={seite} seiten={seiten} href={(ziel) => kundenUrl({ suche, sortierung, seite: ziel })} />
                </>
            )}
        </div>
    );
}
