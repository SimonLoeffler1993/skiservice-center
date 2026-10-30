"use client";

import { useState, useTransition } from "react";
import { History, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { holeLetzteKunden } from "@/lib/kundeactions";
import { cn } from "@/lib/utils";
import { Kunde } from "@/types/skikundentypes";
import { adresse, name, telefon } from "./KundeSuchErgebnisseTabelle";

type LetzteKundenProps = {
    offen: boolean;
    setOffen: (offen: boolean) => void;
    onKundeAuswaehlen: (kunde: Kunde) => void;
};

export function LetzteKundenButton({ onClick, isPending }: { onClick: () => void; isPending: boolean }) {
    return (
        <Button type="button" variant="outline" className="h-10" onClick={onClick} disabled={isPending}>
            <History className="h-4 w-4" />
            Letzte Kunden
        </Button>
    );
}

// Zuletzt angelegte Kunden, z.B. gerade am Kundenterminal erfasst. Der neueste ist vorausgewählt.
export function useLetzteKunden() {
    const [kunden, setKunden] = useState<Kunde[] | null>(null);
    const [fehler, setFehler] = useState<string | null>(null);
    const [auswahl, setAuswahl] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    function laden() {
        startTransition(async () => {
            const antwort = await holeLetzteKunden();
            if (!antwort.success) {
                setFehler(antwort.error);
                setKunden(null);
                return;
            }
            setFehler(null);
            setKunden(antwort.data);
            setAuswahl(antwort.data[0]?.ID ?? null);
        });
    }

    return { kunden, fehler, auswahl, setAuswahl, isPending, laden };
}

export default function LetzteKunden({ offen, setOffen, onKundeAuswaehlen, ...daten }: LetzteKundenProps & ReturnType<typeof useLetzteKunden>) {
    const { kunden, fehler, auswahl, setAuswahl, isPending, laden } = daten;
    if (!offen) return null;

    const ausgewaehlt = kunden?.find((k) => k.ID === auswahl) ?? null;

    return (
        <Card className="mt-6">
            <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">Letzte Kunden</h3>
                    <div className="flex gap-1">
                        <Button type="button" variant="ghost" size="sm" onClick={laden} disabled={isPending}>
                            <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
                            Aktualisieren
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setOffen(false)} title="Schließen">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                {!fehler && kunden && kunden.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Kunden vorhanden.</p>}
                {!kunden && isPending && <p className="text-sm text-muted-foreground">Wird geladen...</p>}

                {kunden && kunden.length > 0 && (
                    <>
                        <div role="radiogroup" aria-label="Letzte Kunden" className="space-y-2">
                            {kunden.map((kunde, index) => {
                                const aktiv = kunde.ID === auswahl;
                                return (
                                    <button
                                        key={kunde.ID}
                                        type="button"
                                        role="radio"
                                        aria-checked={aktiv}
                                        onClick={() => setAuswahl(kunde.ID)}
                                        // Doppelklick übernimmt direkt
                                        onDoubleClick={() => onKundeAuswaehlen(kunde)}
                                        className={cn(
                                            "flex min-h-12 w-full items-center gap-3 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                            aktiv ? "border-primary bg-primary/5" : "hover:bg-muted",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                                aktiv ? "border-primary" : "border-muted-foreground/40",
                                            )}
                                        >
                                            {aktiv && <span className="h-2 w-2 rounded-full bg-primary" />}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold">{name(kunde)}</span>
                                                {index === 0 && (
                                                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800">Neuester</span>
                                                )}
                                                <span className="text-xs text-muted-foreground">#{kunde.ID}</span>
                                            </span>
                                            <span className="block truncate text-sm text-muted-foreground">
                                                {/* Nur vorhandene Angaben, "–" steht für leer */}
                                                {[adresse(kunde), telefon(kunde)].filter((t) => t !== "–").join(" · ") || "Keine Anschrift oder Telefon"}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex justify-end">
                            <Button type="button" onClick={() => ausgewaehlt && onKundeAuswaehlen(ausgewaehlt)} disabled={!ausgewaehlt}>
                                Übernehmen
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
