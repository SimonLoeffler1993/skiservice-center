"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { druckeVerleihEtiketten, getVerleihEtiketten } from "@/lib/saisonverleihactions";
import { VerleihEtikett } from "@/types/saisonverleihtypes";

type EtikettenDruckButtonProps = {
    verleihId: number;
    // Nur die Etiketten dieser Materialzeile
    materialId?: number;
    beschriftung?: string;
    deaktiviert?: boolean;
};

type Zeile = { id: string; text: React.ReactNode; schluessel: string[] };

// Gesamtansicht: Ski und Schuh einer Materialzeile zusammen, nur mit Namen (ohne Namen "Material 1", "Material 2", ...)
function nachMaterial(etiketten: VerleihEtikett[]): Zeile[] {
    const gruppen = new Map<string, VerleihEtikett[]>();
    for (const etikett of etiketten) {
        const materialId = etikett.Schluessel.split("-")[0];
        gruppen.set(materialId, [...(gruppen.get(materialId) ?? []), etikett]);
    }
    return [...gruppen.entries()].map(([materialId, liste], index) => ({
        id: materialId,
        text: <span className="font-medium">{liste[0].Fahrer || `Material ${index + 1}`}</span>,
        schluessel: liste.map((e) => e.Schluessel),
    }));
}

// Einzelansicht einer Materialzeile: Ski und Schuh getrennt
function einzeln(etiketten: VerleihEtikett[]): Zeile[] {
    return etiketten.map((e) => ({
        id: e.Schluessel,
        text: <><span className="font-medium">{e.Name}</span> – {e.Teil}</>,
        schluessel: [e.Schluessel],
    }));
}

/**
 * Etiketten für Leihski und Leihschuhe drucken, je Teil eines,
 * damit das Material in der Werkstatt eindeutig zugeordnet werden kann.
 */
export default function EtikettenDruckButton({ verleihId, materialId, beschriftung = "Etiketten drucken", deaktiviert = false }: EtikettenDruckButtonProps) {
    const [offen, setOffen] = useState(false);
    // Abgewählte Etiketten, alle anderen werden gedruckt
    const [abgewaehlt, setAbgewaehlt] = useState<string[]>([]);
    const [meldung, setMeldung] = useState<{ ok: boolean; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const { data, error, isFetching } = useQuery({
        queryKey: ["verleihEtiketten", verleihId],
        queryFn: () => getVerleihEtiketten(verleihId),
        enabled: offen,
        staleTime: 0,
    });
    const etiketten = data?.filter((e) => materialId === undefined || e.Schluessel.startsWith(`${materialId}-`)) ?? [];
    const zeilen = materialId === undefined ? nachMaterial(etiketten) : einzeln(etiketten);
    const gewaehlt = etiketten.filter((e) => !abgewaehlt.includes(e.Schluessel)).map((e) => e.Schluessel);

    function umschalten(schluessel: string[], an: boolean) {
        setAbgewaehlt((liste) => (an ? liste.filter((s) => !schluessel.includes(s)) : [...liste, ...schluessel]));
    }

    function drucken() {
        startTransition(async () => {
            const antwort = await druckeVerleihEtiketten(verleihId, gewaehlt);
            setMeldung(antwort.success ? { ok: true, text: antwort.data } : { ok: false, text: antwort.error });
        });
    }

    return (
        <Popover
            open={offen}
            onOpenChange={(wert) => {
                setOffen(wert);
                if (wert) {
                    setAbgewaehlt([]);
                    setMeldung(null);
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={deaktiviert} title={deaktiviert ? "Kein Ski und kein Schuh vorhanden" : undefined}>
                    <Tags className="h-4 w-4" />
                    {beschriftung}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-3">
                <p className="text-sm font-medium">Welche Etiketten sollen gedruckt werden?</p>
                {isFetching && !data && <p className="text-sm text-muted-foreground">Lade Etiketten...</p>}
                {error && <p className="text-sm text-destructive">{error.message}</p>}
                {data && etiketten.length === 0 && (
                    <p className="text-sm text-muted-foreground">Kein Ski und kein Schuh vorhanden.</p>
                )}
                {zeilen.length > 0 && (
                    <ul className="space-y-2">
                        {zeilen.map((zeile) => (
                            <li key={zeile.id}>
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={zeile.schluessel.every((s) => !abgewaehlt.includes(s))}
                                        onCheckedChange={(wert) => umschalten(zeile.schluessel, wert === true)}
                                    />
                                    <span>{zeile.text}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                <Button type="button" className="w-full" onClick={drucken} disabled={isPending || gewaehlt.length === 0}>
                    {isPending ? <Spinner /> : `Drucken (${gewaehlt.length})`}
                </Button>
                {meldung && (
                    <p className={`text-sm ${meldung.ok ? "text-green-600" : "text-destructive"}`} aria-live="polite">{meldung.text}</p>
                )}
            </PopoverContent>
        </Popover>
    );
}
