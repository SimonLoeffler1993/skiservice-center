import { useEffect, useRef, useState } from "react";

export function useSkiScannerSocket(backEndUrl: string) {
    const ws = useRef<WebSocket | null>(null);
    const [nachricht, setNachricht] = useState<string | null>(null);
    const [verbunden, setVerbunden] = useState(false);

    useEffect(() => {
        ws.current = new WebSocket(backEndUrl.replace(/^http/, 'ws') + "/api/v1/scanner/skiscanner/data");
        ws.current.onopen = () => {
            console.log('WebSocket verbunden');
            setVerbunden(true);
        };
        ws.current.onmessage = (event) => {
            console.log('Nachricht erhalten:', event.data);
            setNachricht(event.data);
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

    return { nachricht, verbunden, nachrichtSenden };

}