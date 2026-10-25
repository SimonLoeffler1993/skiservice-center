"use client";

import { cn } from "@/lib/utils";
import HardwareScanner from "./HardwareScanner";
import KameraScanner from "./KameraScanner";
import ScanModusUmschalter, { useScanModus } from "./ScanModusUmschalter";

type FertigstellenProps = {
    backendUrl: string;
}

// Fertigstellen-Ansicht: Kopf mit Modus-Umschalter, darunter Hardware-Scanner oder Kamera
export default function SkiserviceFertigScanner({ backendUrl }: FertigstellenProps) {
    const [modus, setModus] = useScanModus();

    return (
        <div className={cn("mx-auto flex w-full flex-col gap-4", modus === "kamera" ? "max-w-6xl" : "max-w-3xl")}>
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Skiservice</p>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Fertigstellen</h1>
                </div>
                <ScanModusUmschalter modus={modus} onWechsel={setModus} />
            </header>

            {/* Nur der aktive Modus ist eingehängt: WebSocket bzw. Kamera laufen nur bei Bedarf */}
            {modus === "hardware" ? <HardwareScanner backendUrl={backendUrl} /> : <KameraScanner />}
        </div>
    )
}
