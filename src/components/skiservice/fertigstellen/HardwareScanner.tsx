"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScanBarcode, Sun, SunDim } from "lucide-react";

import { useBildschirmAn } from "@/hooks/useBildschirmAn";
import { scannerGeraeteOptions } from "@/hooks/useScannerGeraeteOptions";
import { useSkiScannerSocket } from "@/hooks/useSkiScannerSocket";
import ScannerVerbindung from "../ScannerVerbindung";
import BindungButtons from "./BindungButtons";
import FertigButtons from "./FertigButtons";
import HardwareScannerStatus from "./HardwareScannerStatus";
import ScannerAuswahl, { useScannerWahl } from "./ScannerAuswahl";
import ScanLeer from "./ScanLeer";
import ScanMeldung from "./ScanMeldung";
import ServiceErgebnis from "./ServiceErgebnis";
import VerleihErgebnis from "./VerleihErgebnis";

// Hardware-Scanner: Scans kommen über das Backend per WebSocket, Fertigstellen mit Countdown
export default function HardwareScanner({ backendUrl }: { backendUrl: string }) {
    const [scannerWahl, setScannerWahl] = useScannerWahl();
    const { nachricht, scan, scanNr, verbunden, error } = useSkiScannerSocket(backendUrl, scannerWahl);
    const geraete = useQuery(scannerGeraeteOptions);
    const bildschirmAn = useBildschirmAn();
    const queryClient = useQueryClient();
    const auftragId = scan?.service_id;
    const verleihId = scan?.art === "verleih" ? scan.verleih_id : null;
    // Dauer kommt mit dem Scan aus den Einstellungen, ältere API ohne Feld: 10 s
    const sekunden = scan?.countdown ?? 10;
    // Ältere API ohne Feld: fertig stellen
    const aktion = scan?.aktion === "bindung" ? "bindung" : "fertig";

    // Ein Scan zeigt, dass der Scanner da ist: Status gleich neu laden statt erst nach 10 s
    useEffect(() => {
        if (scanNr > 0) queryClient.invalidateQueries({ queryKey: scannerGeraeteOptions.queryKey });
    }, [scanNr, queryClient]);

    // Status-Meldungen (z.B. von einem anderen Gerät fertig gestellt): angezeigten Auftrag neu laden
    useEffect(() => {
        if (nachricht?.service_id && !nachricht.scannername) {
            queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", nachricht.service_id] });
        }
    }, [nachricht, queryClient]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <ScannerVerbindung verbunden={verbunden} />
                    <HardwareScannerStatus geraete={geraete.data} wahl={scannerWahl} fehler={geraete.isError} />
                </div>
                <div className="flex items-center gap-1">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {bildschirmAn ? <Sun className="h-3.5 w-3.5" /> : <SunDim className="h-3.5 w-3.5" />}
                        {bildschirmAn ? "Bildschirm bleibt an" : "Tippen, damit der Bildschirm anbleibt"}
                    </span>
                    <ScannerAuswahl wahl={scannerWahl} geraete={geraete.data ?? []} onWechsel={setScannerWahl} />
                </div>
            </div>
            {nachricht && <p className="text-sm text-muted-foreground">{nachricht.message}</p>}

            {error && <ScanMeldung meldung={{ ok: false, text: error }} />}

            {/* Gespeichert wird immer erst nach dem Countdown, je nach Modus des Scanners fertig oder Bindung geprüft */}
            {verleihId ? (
                <VerleihErgebnis key={scanNr} verleihId={verleihId} materialId={scan?.material_id ?? null} countdownSekunden={sekunden} />
            ) : auftragId ? (
                <ServiceErgebnis
                    key={scanNr}
                    auftragId={auftragId}
                    skiId={scan?.ski_id}
                    aktion={aktion}
                    aktionen={(kontext) =>
                        aktion === "bindung" ? <BindungButtons {...kontext} sekunden={sekunden} /> : <FertigButtons {...kontext} sekunden={sekunden} />
                    }
                />
            ) : (
                <ScanLeer
                    icon={ScanBarcode}
                    titel="Etikett scannen"
                    text="Den QR-Code auf dem Etikett mit dem Scanner erfassen. Je nach Modus des Scanners wird der Ski nach dem Countdown fertig gestellt oder die Bindung als geprüft markiert."
                />
            )}
        </div>
    );
}
