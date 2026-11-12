"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type FilterGruppe = {
    // Name des URL-Parameters, z.B. "status"
    parameter: string;
    titel: string;
    // Aktueller Wert, ohne Angabe alle
    wert?: string;
    optionen: { wert: string; text: string }[];
};

// Weitere Filter der Liste (Status, Bezahlt, ...) hinter einem Button, aktive als entfernbare Chips daneben.
// Die Werte stehen in der URL, andere Parameter bleiben erhalten.
export default function ListenFilter({ gruppen }: { gruppen: FilterGruppe[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const aktiv = gruppen.filter((gruppe) => gruppe.wert !== undefined);

    function setzen(aenderungen: Record<string, string | undefined>) {
        const parameter = new URLSearchParams(searchParams.toString());
        for (const [name, wert] of Object.entries(aenderungen)) {
            if (wert === undefined) parameter.delete(name);
            else parameter.set(name, wert);
        }
        const query = parameter.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }

    function alleZuruecksetzen() {
        setzen(Object.fromEntries(gruppen.map((gruppe) => [gruppe.parameter, undefined])));
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 bg-background">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                        {aktiv.length > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                                {aktiv.length}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)] space-y-4">
                    {gruppen.map((gruppe) => (
                        <div key={gruppe.parameter} className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground">{gruppe.titel}</p>
                            <div role="radiogroup" aria-label={gruppe.titel} className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
                                {[{ wert: undefined, text: "Alle" }, ...gruppe.optionen].map(({ wert, text }) => (
                                    <button
                                        key={wert ?? "alle"}
                                        type="button"
                                        role="radio"
                                        aria-checked={gruppe.wert === wert}
                                        onClick={() => setzen({ [gruppe.parameter]: wert })}
                                        className={cn(
                                            "h-9 rounded-md px-3 text-sm font-medium transition-colors",
                                            gruppe.wert === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {aktiv.length > 0 && (
                        <Button type="button" variant="ghost" size="sm" onClick={alleZuruecksetzen}>
                            <X className="h-4 w-4" />
                            Alle Filter zurücksetzen
                        </Button>
                    )}
                </PopoverContent>
            </Popover>

            {aktiv.map((gruppe) => (
                <button
                    key={gruppe.parameter}
                    type="button"
                    onClick={() => setzen({ [gruppe.parameter]: undefined })}
                    aria-label={`Filter ${gruppe.titel} entfernen`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-background pl-3 pr-2 text-sm hover:bg-muted"
                >
                    <span className="text-muted-foreground">{gruppe.titel}:</span>
                    {gruppe.optionen.find((option) => option.wert === gruppe.wert)?.text ?? gruppe.wert}
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
            ))}
        </>
    );
}
