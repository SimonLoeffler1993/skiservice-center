"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { verlaufOptions } from "@/hooks/useVerlaufOptions";
import type { VerlaufBezug } from "@/types/ereignis";

// Zuerst nur die letzten Einträge, der Rest hinter "Alle anzeigen"
const ANFANG = 6;

/** Verlauf eines Auftrags bzw. Verleihs: was passiert ist, wann und durch wen (Seitenspalte). */
export default function VerlaufListe({ bezug, id }: { bezug: VerlaufBezug; id: number }) {
    const { data, isPending, error } = useQuery(verlaufOptions(bezug, id));
    const [alle, setAlle] = useState(false);

    if (isPending) return <p className="text-sm text-muted-foreground">Verlauf wird geladen...</p>;
    if (error) return <p className="text-sm text-destructive">{error.message}</p>;
    if (data.length === 0) return <p className="text-sm text-muted-foreground">Noch nichts protokolliert.</p>;

    const sichtbar = alle ? data : data.slice(0, ANFANG);
    return (
        <div className="space-y-2">
            <ol className="relative space-y-3 border-l pl-4">
                {sichtbar.map((e) => (
                    <li key={e.id} className="relative">
                        <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground/60" />
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                            <span className="text-sm font-medium">{e.art_bezeichnung}</span>
                            <span className="text-xs text-muted-foreground">{format(parseISO(e.zeitpunkt), "dd.MM.yyyy HH:mm")}</span>
                        </div>
                        {e.text && <p className="text-sm text-muted-foreground">{e.text}</p>}
                        <p className="text-xs text-muted-foreground">
                            {e.benutzer_name ?? "ohne Anmeldung"}{e.geraet ? ` · ${e.geraet}` : ""}
                        </p>
                    </li>
                ))}
            </ol>
            {data.length > ANFANG && (
                <Button variant="link" size="sm" className="px-0" onClick={() => setAlle(!alle)}>
                    {alle ? "Weniger anzeigen" : `Alle ${data.length} anzeigen`}
                </Button>
            )}
        </div>
    );
}
