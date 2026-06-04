"use client";

import { useSkiScannerSocket } from "@/hooks/useSkiScannerSocket";
import ScannerVerbindung from "../ScannerVerbindung";
import SkiListeSelect from "./SkiListeSelect";
import KundeKurzDetails from "@/components/kunde/KundeKurzDetails";


type FertigstellenProps = {
    backendUrl: string;
}


export default function SkiserviceFertigScanner({ backendUrl }: FertigstellenProps) {
    const { nachricht, verbunden, error } = useSkiScannerSocket(backendUrl);

    console.log("Kunde:", nachricht?.data);


    return (
        <div className="flex flex-col gap-5 p-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Skiservice</p>
                    <h1 className="text-xl font-medium text-foreground">Fertigstellen</h1>
                </div>
                <ScannerVerbindung verbunden={verbunden} />
            </div>

            {/* Status-Leiste */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
                {error ? (
                    <span className="text-destructive">Fehler: {error}</span>
                ) : (
                    <span>
                        Letzte Nachricht:{" "}
                        <span className="text-foreground">
                            {nachricht?.message || "Keine Nachricht vorhanden"}
                        </span>
                    </span>
                )}
            </div>


            {/* Kundenkarte */}
            <KundeKurzDetails kunde={nachricht?.data?.kunde} />
     
            {/* Serviceaufstellung */}
            <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Serviceaufstellung
                </p>
                <SkiListeSelect skis={nachricht?.data?.skis || []} selectedSkiIds={nachricht?.ski_id} />
            </div>
        </div>
    )
}