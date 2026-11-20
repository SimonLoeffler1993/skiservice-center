import { ScannerWebSocketMessage, ScannerWebSocketMessageSchema } from "@/types/skiscanner";
import { useEffect, useRef, useState } from "react";

import { holeTicket } from "@/lib/anmeldungactions";

// scannerName: nur Scans dieses Scanners übernehmen (null = alle)
export function useSkiScannerSocket(backEndUrl: string, scannerName: string | null = null) {
    const ws = useRef<WebSocket | null>(null);
    // Als Ref, damit ein Wechsel des Scanners die Verbindung nicht neu aufbaut
    const scannerNameRef = useRef(scannerName);
    useEffect(() => {
        scannerNameRef.current = scannerName;
    }, [scannerName]);
    const [nachricht, setNachricht] = useState<ScannerWebSocketMessage | null>(null);
    // Letzter echter Scan (mit Scannername) eines Service- oder Verleih-Etiketts,
    // Status-Meldungen z.B. nach dem Fertigstellen zählen nicht
    const [scan, setScan] = useState<ScannerWebSocketMessage | null>(null);
    // Zählt jeden Scan, auch wenn derselbe Ski erneut gescannt wird
    const [scanNr, setScanNr] = useState(0);
    const [verbunden, setVerbunden] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let beendet = false;
        let versuch = 0;
        let wiederTimer: number | undefined;

        // Vor jedem Aufbau ein frisches Ticket holen (der Browser kann am WebSocket keine Header setzen)
        const verbinden = async () => {
            const ticket = await holeTicket("/scanner/skiscanner/data");
            if (beendet) return;
            const url = backEndUrl.replace(/^http/, 'ws') + "/api/v1/scanner/skiscanner/data" + (ticket ? `?ticket=${encodeURIComponent(ticket)}` : "");
            ws.current = new WebSocket(url);
            ws.current.onopen = () => {
                console.log('WebSocket verbunden');
                versuch = 0;
                setVerbunden(true);
            };
            ws.current.onmessage = (event) => {
                try {
                    setError(null);
                    console.log('Nachricht erhalten:', event.data);
                    const parsedata = ScannerWebSocketMessageSchema.safeParse(JSON.parse(event.data));
                    if (!parsedata.success) {
                        console.error('Ungültige WebSocket-Nachricht:', parsedata.error);
                        setError('Ungültige WebSocket-Nachricht');
                        return;
                    }
                    // Scan eines anderen Scanners: auf diesem Tablet ignorieren
                    const name = parsedata.data.scannername;
                    if (name && scannerNameRef.current && name !== scannerNameRef.current) return;

                    setNachricht(parsedata.data);
                    if (parsedata.data.scannername) {
                        setScan(parsedata.data);
                        setScanNr((nr) => nr + 1);
                    }
                } catch (error) {
                    console.error('Fehler beim Parsen der WebSocket-Nachricht:', error);
                    setError('Fehler beim Parsen der WebSocket-Nachricht');
                }
            };
            ws.current.onclose = (event) => {
                console.log('WebSocket getrennt', event.code);
                setVerbunden(false);
                if (beendet) return;
                // 4401 = nicht angemeldet: neu verbinden holt ein neues Ticket; sonst mit wachsender Pause (max. 30 s)
                versuch += 1;
                wiederTimer = window.setTimeout(verbinden, Math.min(30_000, 1_000 * 2 ** Math.min(versuch, 5)));
            };
        };
        void verbinden();
        return () => {
            beendet = true;
            window.clearTimeout(wiederTimer);
            ws.current?.close();
        };
    }, [backEndUrl]);

    const nachrichtSenden = (message: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(message);
        } else {
            console.warn('WebSocket ist nicht verbunden');
        }
    };

    return { nachricht, scan, scanNr, verbunden, nachrichtSenden, error };

}