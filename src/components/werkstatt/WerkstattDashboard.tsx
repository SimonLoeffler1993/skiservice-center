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
import OffeneSkiListe from "./OffeneSkiListe";
import VerleihUebersicht from "./VerleihUebersicht";
import VerleihVorbereitung from "./VerleihVorbereitung";
import WerkstattAuswertung from "./WerkstattAuswertung";

// Werkstatt-Dashboard: was noch zu tun ist, kleine Auswertung und Verleih-Übersicht
export default function WerkstattDashboard() {
    const queryClient = useQueryClient();
    const { data, error, isLoading, isFetching, refetch } = useQuery(werkstattOptions);

    // Jede Scanner-Meldung (Ski fertig, Bindung geprüft) lädt das Dashboard neu,
    // sonst alle 30 s über refetchInterval
    const { nachricht } = useSkiScannerSocket(useBackendUrl());
    useEffect(() => {
        if (nachricht) queryClient.invalidateQueries({ queryKey: werkstattOptions.queryKey });
    }, [nachricht, queryClient]);

    return (
        <div className="space-y-8">
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
            ) : (
                <>
                    <OffeneSkiListe skis={data.ski_offen} />
                    <VerleihVorbereitung verleihe={data.verleih_offen} />
                    <WerkstattAuswertung auswertung={data.auswertung} />
                    <VerleihUebersicht saison={data.verleih.saison} tag={data.verleih.tag} />
                </>
            )}
        </div>
    );
}
