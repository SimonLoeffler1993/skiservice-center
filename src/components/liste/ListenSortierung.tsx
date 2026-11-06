"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ListenSortierung as Sortierung } from "@/types/liste";

type ListenSortierungProps = {
    sortierung: Sortierung;
    // Standard der Liste, steht nicht in der URL
    standard: Sortierung;
};

const OPTIONEN: { wert: Sortierung; text: string; titel: string }[] = [
    { wert: "neueste", text: "Neueste", titel: "Zuletzt erfasste oben" },
    { wert: "aelteste", text: "Älteste", titel: "Zuerst erfasste oben" },
];

// Reihenfolge der Liste als Segment-Umschalter (?sortierung=). Andere Filter bleiben erhalten.
export default function ListenSortierung({ sortierung, standard }: ListenSortierungProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function wechseln(wert: Sortierung) {
        const parameter = new URLSearchParams(searchParams.toString());
        if (wert === standard) parameter.delete("sortierung");
        else parameter.set("sortierung", wert);
        const query = parameter.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    return (
        <div role="radiogroup" aria-label="Sortierung" className="inline-flex rounded-lg bg-muted p-1">
            {OPTIONEN.map(({ wert, text, titel }) => (
                <button
                    key={wert}
                    type="button"
                    role="radio"
                    title={titel}
                    aria-checked={sortierung === wert}
                    onClick={() => wechseln(wert)}
                    className={cn(
                        "h-8 rounded-md px-4 text-sm font-medium transition-colors",
                        sortierung === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                >
                    {text}
                </button>
            ))}
        </div>
    );
}
