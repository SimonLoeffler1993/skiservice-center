"use client";

import { useSkiScannerSocket } from "@/hooks/useSkiScannerSocket";

type FertigstellenProps = {
    backendUrl: string;
}

export default function SkiserviceFertigScanner({ backendUrl }: FertigstellenProps) {
    const { nachricht, verbunden } = useSkiScannerSocket(backendUrl);
    return (
        <div>
            <h1>Skiservice Fertigstellen</h1>
            <p>Nachricht: {nachricht}</p>
            <p>Verbunden: {verbunden ? 'Ja' : 'Nein'}</p>
        </div>
    )
}