"use client";

import { useSyncExternalStore } from "react";
import { Camera, ScanBarcode } from "lucide-react";

import { cn } from "@/lib/utils";

export type ScanModus = "hardware" | "kamera";

const SPEICHER_SCHLUESSEL = "fertigstellen-scanmodus";
const EREIGNIS = "fertigstellen-scanmodus";

function lesen(): ScanModus {
    try {
        return localStorage.getItem(SPEICHER_SCHLUESSEL) === "kamera" ? "kamera" : "hardware";
    } catch {
        return "hardware";
    }
}

function abonnieren(neu: () => void) {
    window.addEventListener("storage", neu);
    window.addEventListener(EREIGNIS, neu);
    return () => {
        window.removeEventListener("storage", neu);
        window.removeEventListener(EREIGNIS, neu);
    };
}

// Gewählter Scan-Modus, pro Gerät gespeichert (Standard: Hardware-Scanner)
export function useScanModus(): [ScanModus, (modus: ScanModus) => void] {
    const modus = useSyncExternalStore(abonnieren, lesen, () => "hardware" as ScanModus);
    function setzen(neu: ScanModus) {
        try {
            localStorage.setItem(SPEICHER_SCHLUESSEL, neu);
        } catch {
            // Ohne Speicher gilt die Wahl nur bis zum Neuladen
        }
        window.dispatchEvent(new Event(EREIGNIS));
    }
    return [modus, setzen];
}

const MODI: { wert: ScanModus; text: string; kurz: string; icon: typeof Camera }[] = [
    { wert: "hardware", text: "Hardware-Scanner", kurz: "Scanner", icon: ScanBarcode },
    { wert: "kamera", text: "Kamera", kurz: "Kamera", icon: Camera },
];

// Segment-Umschalter zwischen Hardware-Scanner und Kamera
export default function ScanModusUmschalter({ modus, onWechsel }: { modus: ScanModus; onWechsel: (modus: ScanModus) => void }) {
    return (
        <div role="radiogroup" aria-label="Scan-Modus" className="inline-flex w-full rounded-lg bg-muted p-1 sm:w-auto">
            {MODI.map(({ wert, text, kurz, icon: Icon }) => (
                <button
                    key={wert}
                    type="button"
                    role="radio"
                    aria-checked={modus === wert}
                    aria-label={text}
                    onClick={() => onWechsel(wert)}
                    className={cn(
                        "flex h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors sm:flex-none",
                        modus === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {/* Auf dem Handy kurz, damit nichts umbricht */}
                    <span className="sm:hidden">{kurz}</span>
                    <span className="hidden sm:inline">{text}</span>
                </button>
            ))}
        </div>
    );
}
