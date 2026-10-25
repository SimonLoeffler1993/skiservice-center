"use client";

import HardwareScanner from "./HardwareScanner";

type FertigstellenProps = {
    backendUrl: string;
}

// Fertigstellen-Ansicht: Kopf und Scanner, für das Tablet optimiert
export default function SkiserviceFertigScanner({ backendUrl }: FertigstellenProps) {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <header>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Skiservice</p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Fertigstellen</h1>
            </header>

            <HardwareScanner backendUrl={backendUrl} />
        </div>
    )
}
