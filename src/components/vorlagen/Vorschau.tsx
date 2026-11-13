"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { vorschauMailvorlage } from "@/lib/mailvorlagenactions";

type VorschauProps = {
    schluessel: string;
    betreff: string;
    inhalt: string;
}

// Gibt den Wert erst weiter, wenn er sich eine Weile nicht geändert hat
function useVerzoegert<T>(wert: T, millisekunden: number): T {
    const [verzoegert, setVerzoegert] = useState(wert);
    useEffect(() => {
        const timer = setTimeout(() => setVerzoegert(wert), millisekunden);
        return () => clearTimeout(timer);
    }, [wert, millisekunden]);
    return verzoegert;
}

// Zeigt die Mail so, wie sie die API mit Beispieldaten rendert
export default function Vorschau({ schluessel, betreff, inhalt }: VorschauProps) {
    const stand = useVerzoegert(`${betreff}\u0000${inhalt}`, 500);
    const { data, error, isPending } = useQuery({
        queryKey: ["mailvorlagen", "vorschau", schluessel, stand],
        queryFn: async () => {
            const [b, i] = stand.split("\u0000");
            const antwort = await vorschauMailvorlage(schluessel, { betreff: b, inhalt: i });
            if (!antwort.success) throw new Error(antwort.error);
            return antwort.data;
        },
        // Beim Tippen die letzte Vorschau stehen lassen, bis die neue da ist
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        gcTime: 1000 * 30,
        retry: false,
    });

    return (
        <div className="space-y-2">
            {error && <p className="text-sm text-destructive">{error.message}</p>}
            {isPending && !data && <p className="text-sm text-muted-foreground">Lade Vorschau...</p>}
            {data && (
                <div className="overflow-hidden rounded-md border">
                    <div className="border-b bg-muted/40 px-4 py-2 text-sm">
                        <span className="text-muted-foreground">Betreff: </span>
                        <span className="font-medium">{data.betreff}</span>
                    </div>
                    {/* sandbox: die Mail kann in der Vorschau nichts ausführen und keine Links öffnen */}
                    <iframe title="Vorschau der Mail" sandbox="" srcDoc={data.html} className="h-[28rem] w-full bg-white" />
                </div>
            )}
        </div>
    );
}
