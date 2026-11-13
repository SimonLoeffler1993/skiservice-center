"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Gauge, Loader2, ScanLine, ServerCrash } from "lucide-react";

import { ListenSkeleton } from "@/components/liste/ListenTeile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useBackendUrl } from "@/context/backend-context";
import { useSkiScannerSocket } from "@/hooks/useSkiScannerSocket";
import { werkstattOptions } from "@/hooks/useWerkstattOptions";
import { cn } from "@/lib/utils";
import AutoWechsel from "./AutoWechsel";
import OffeneSkiListe from "./OffeneSkiListe";
import VerleihUebersicht from "./VerleihUebersicht";
import VerleihVorbereitung from "./VerleihVorbereitung";
import { ServiceAuswertung, VerleihAuswertung } from "./WerkstattAuswertung";
import { werkstattUrl, type WerkstattAnsicht } from "./werkstattUrl";

type WerkstattDashboardProps = {
    // Alles aus der URL: Ansicht, automatischer Wechsel und dessen Dauer
    ansicht: WerkstattAnsicht;
    auto: boolean;
    sekunden: number;
};

// Werkstatt-Dashboard mit zwei Ansichten: Skiservice und Verleih.
// Je Ansicht: was noch zu tun ist und eine kleine Auswertung
export default function WerkstattDashboard({ ansicht, auto, sekunden }: WerkstattDashboardProps) {
    const queryClient = useQueryClient();
    // Eine Abfrage für beide Ansichten, so wechselt die Ansicht ohne Laden
    const { data, error, isLoading, isFetching, refetch } = useQuery(werkstattOptions);

    // Jede Scanner-Meldung (Ski fertig, Bindung geprüft) lädt das Dashboard neu,
    // sonst alle 30 s über refetchInterval
    const { nachricht } = useSkiScannerSocket(useBackendUrl());
    useEffect(() => {
        if (nachricht) queryClient.invalidateQueries({ queryKey: werkstattOptions.queryKey });
    }, [nachricht, queryClient]);

    // Anzahl im Umschalter: Aufträge mit offenen Ski bzw. Verleihe in Vorbereitung
    const anzahl: Record<WerkstattAnsicht, number | null> = {
        service: data ? new Set(data.ski_offen.map((ski) => ski.auftrag_id)).size : null,
        verleih: data ? data.verleih_offen.length : null,
    };
    const ansichten: { wert: WerkstattAnsicht; text: string }[] = [
        { wert: "service", text: "Skiservice" },
        { wert: "verleih", text: "Verleih" },
    ];

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                        <Gauge className="h-5 w-5 text-muted-foreground" />
                    </span>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Werkstatt</h1>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            {data ? `Saison ${data.saison.Name}` : "Offene Arbeit und Auswertung"}
                            {isFetching && !isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-label="Wird aktualisiert" />}
                        </p>
                    </div>
                </div>
                <Button asChild variant="outline" className="h-10">
                    <Link href="/scanner">
                        <ScanLine className="h-4 w-4" />
                        Scanner
                    </Link>
                </Button>
            </header>

            {/* Umschalter der Ansicht und automatischer Wechsel, beides steht in der URL */}
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <nav className="inline-flex h-11 items-center rounded-lg bg-muted p-[3px]" aria-label="Ansicht">
                    {ansichten.map(({ wert, text }) => (
                        <Link
                            key={wert}
                            href={werkstattUrl(wert, auto, sekunden)}
                            replace
                            scroll={false}
                            aria-current={ansicht === wert ? "page" : undefined}
                            className={cn(
                                "inline-flex h-full items-center gap-2 rounded-md px-4 text-sm font-medium text-muted-foreground",
                                ansicht === wert && "bg-background text-foreground shadow-sm",
                            )}
                        >
                            {text}
                            {anzahl[wert] !== null && <span className="tabular-nums text-muted-foreground">{anzahl[wert]}</span>}
                        </Link>
                    ))}
                </nav>
                <AutoWechsel ansicht={ansicht} auto={auto} sekunden={sekunden} />
            </div>

            {isLoading ? (
                <ListenSkeleton />
            ) : !data ? (
                <Alert variant="destructive" className="max-w-lg">
                    <ServerCrash />
                    <AlertTitle>Werkstatt-Übersicht nicht verfügbar</AlertTitle>
                    <AlertDescription className="flex flex-col gap-3">
                        <p>{error?.message ?? "Die Daten konnten nicht geladen werden."}</p>
                        <Button variant="outline" className="w-fit" onClick={() => refetch()}>Erneut versuchen</Button>
                    </AlertDescription>
                </Alert>
            ) : ansicht === "service" ? (
                <div className="space-y-8">
                    <OffeneSkiListe skis={data.ski_offen} />
                    <ServiceAuswertung auswertung={data.auswertung} />
                </div>
            ) : (
                <div className="space-y-8">
                    <VerleihVorbereitung verleihe={data.verleih_offen} />
                    <VerleihAuswertung auswertung={data.auswertung} />
                    <VerleihUebersicht saison={data.verleih.saison} tag={data.verleih.tag} />
                </div>
            )}
        </div>
    );
}
