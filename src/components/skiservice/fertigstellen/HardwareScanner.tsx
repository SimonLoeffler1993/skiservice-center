"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ScanBarcode } from "lucide-react";

import { useSkiScannerSocket } from "@/hooks/useSkiScannerSocket";
import ScannerVerbindung from "../ScannerVerbindung";
import FertigButtons from "./FertigButtons";
import ScanLeer from "./ScanLeer";
import ScanMeldung from "./ScanMeldung";
import ServiceErgebnis from "./ServiceErgebnis";

// Hardware-Scanner: Scans kommen über das Backend per WebSocket, Fertigstellen mit Countdown
export default function HardwareScanner({ backendUrl }: { backendUrl: string }) {
    const { nachricht, scan, scanNr, verbunden, error } = useSkiScannerSocket(backendUrl);
    const queryClient = useQueryClient();
    const auftragId = scan?.service_id;

    // Status-Meldungen (z.B. von einem anderen Gerät fertig gestellt): angezeigten Auftrag neu laden
    useEffect(() => {
        if (nachricht?.service_id && !nachricht.scannername) {
            queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", nachricht.service_id] });
        }
    }, [nachricht, queryClient]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <ScannerVerbindung verbunden={verbunden} />
                {nachricht && <p className="text-sm text-muted-foreground">{nachricht.message}</p>}
            </div>

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
