import { ScannerWebSocketMessage, ScannerWebSocketMessageSchema } from "@/types/skiscanner";
import { useEffect, useRef, useState } from "react";

export function useSkiScannerSocket(backEndUrl: string) {
    const ws = useRef<WebSocket | null>(null);
    const [nachricht, setNachricht] = useState<ScannerWebSocketMessage | null>(null);
    // Letzter echter Scan (mit Scannername), Status-Meldungen z.B. nach dem Fertigstellen zählen nicht
    const [scan, setScan] = useState<ScannerWebSocketMessage | null>(null);
    // Zählt jeden Scan, auch wenn derselbe Ski erneut gescannt wird
    const [scanNr, setScanNr] = useState(0);
    const [verbunden, setVerbunden] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(backEndUrl.replace(/^http/, 'ws') + "/api/v1/scanner/skiscanner/data");
        ws.current.onopen = () => {
            console.log('WebSocket verbunden');
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
        ws.current.onclose = () => {
            console.log('WebSocket getrennt');
            setVerbunden(false);
        };
        return () => {
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