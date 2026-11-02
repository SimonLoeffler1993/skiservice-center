"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScanBarcode, Sun, SunDim } from "lucide-react";

import { useBildschirmAn } from "@/hooks/useBildschirmAn";
import { scannerGeraeteOptions } from "@/hooks/useScannerGeraeteOptions";
import { useSkiScannerSocket } from "@/hooks/useSkiScannerSocket";
import ScannerVerbindung from "../ScannerVerbindung";
import FertigButtons from "./FertigButtons";
import HardwareScannerStatus from "./HardwareScannerStatus";
import ScannerAuswahl, { useScannerWahl } from "./ScannerAuswahl";
import ScanLeer from "./ScanLeer";
import ScanMeldung from "./ScanMeldung";
import ServiceErgebnis from "./ServiceErgebnis";

// Hardware-Scanner: Scans kommen über das Backend per WebSocket, Fertigstellen mit Countdown
export default function HardwareScanner({ backendUrl }: { backendUrl: string }) {
    const [scannerWahl, setScannerWahl] = useScannerWahl();
    const { nachricht, scan, scanNr, verbunden, error } = useSkiScannerSocket(backendUrl, scannerWahl);
    const geraete = useQuery(scannerGeraeteOptions);
    const bildschirmAn = useBildschirmAn();
    const queryClient = useQueryClient();
    const auftragId = scan?.service_id;

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

            {auftragId ? (
                <ServiceErgebnis
                    key={scanNr}
                    auftragId={auftragId}
                    skiId={scan?.ski_id}
                    aktionen={({ auftrag, auswahl, erledigt }) => (
                        <FertigButtons serviceId={auftrag.id} selectedSkiIds={auswahl.map((ski) => ski.id)} onErledigt={erledigt} />
                    )}
                />
            ) : (
                <ScanLeer
                    icon={ScanBarcode}
                    titel="Etikett scannen"
                    text="Den QR-Code auf dem Service-Etikett mit dem Scanner erfassen. Der Ski wird ausgewählt und nach 10 Sekunden fertig gestellt."
                />
            )}
        </div>
    );
}
