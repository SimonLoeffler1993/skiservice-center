"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { ANSICHT_PARAMETER, ansichtInUrl, ansichtMerken, ListenAnsicht, useGemerkteAnsicht, useListenAnsicht } from "./listenAnsicht";

const OPTIONEN: { wert: ListenAnsicht; text: string; icon: LucideIcon }[] = [
    { wert: "kacheln", text: "Kacheln", icon: LayoutGrid },
    { wert: "liste", text: "Liste", icon: List },
];

// Kacheln oder Liste als Segment-Umschalter (?ansicht=liste). Die Wahl wird im Browser gemerkt.
export default function ListenAnsichtUmschalter({ className }: { className?: string }) {
    const searchParams = useSearchParams();
    const gemerkt = useGemerkteAnsicht();
    const ansicht = useListenAnsicht();
    const inUrl = searchParams.has(ANSICHT_PARAMETER);

    // Ohne Angabe in der URL gilt die gemerkte Wahl, die URL zeigt sie dann auch
    useEffect(() => {
        if (!inUrl && gemerkt === "liste") ansichtInUrl("liste");
    }, [inUrl, gemerkt]);

    function wechseln(wert: ListenAnsicht) {
        ansichtMerken(wert);
        ansichtInUrl(wert);
    }

    return (
        <div role="radiogroup" aria-label="Ansicht" className={cn("inline-flex rounded-lg bg-muted p-1", className)}>
            {OPTIONEN.map(({ wert, text, icon: Icon }) => (
                <button
                    key={wert}
                    type="button"
                    role="radio"
                    title={text}
                    aria-label={text}
                    aria-checked={ansicht === wert}
                    onClick={() => wechseln(wert)}
                    className={cn(
                        "flex h-8 items-center rounded-md px-3 transition-colors",
                        ansicht === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                >
                    <Icon className="h-4 w-4" />
                </button>
            ))}
        </div>
    );
}
