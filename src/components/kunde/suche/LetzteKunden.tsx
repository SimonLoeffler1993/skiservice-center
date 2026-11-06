"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { History, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { checkinStatusOptions } from "@/hooks/useCheckinOptions";
import { holeLetzteKunden } from "@/lib/kundeactions";
import { cn } from "@/lib/utils";
import { Kunde } from "@/types/skikundentypes";
import CheckinListe from "./CheckinListe";
import { adresse, name, telefon } from "./KundeSuchErgebnisseTabelle";

type LetzteKundenProps = {
    offen: boolean;
    setOffen: (offen: boolean) => void;
    onKundeAuswaehlen: (kunde: Kunde) => void;
};

export function LetzteKundenButton({ onClick, isPending }: { onClick: () => void; isPending: boolean }) {
    const { data: status } = useQuery(checkinStatusOptions);
    const offen = status?.offen ?? 0;

    return (
        <Button type="button" variant="outline" className="h-10" onClick={onClick} disabled={isPending}>
            <History className="h-4 w-4" />
            Letzte Kunden
            {offen > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground" title={`${offen} offene Check-ins`}>
                    {offen}
                </span>
            )}
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
    const queryClient = useQueryClient();
    const { data: status } = useQuery(checkinStatusOptions);
    const [ansicht, setAnsicht] = useState<"letzte" | "checkin">("letzte");
    if (!offen) return null;

    // Ohne eingerichteten Check-in gibt es keinen Umschalter
    const mitCheckin = status?.eingerichtet === true;
    const zeigeCheckin = mitCheckin && ansicht === "checkin";

    const ausgewaehlt = kunden?.find((k) => k.ID === auswahl) ?? null;

    return (
        <Card className="mt-6">
            <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {mitCheckin ? (
                        <div role="radiogroup" aria-label="Ansicht" className="inline-flex rounded-lg bg-muted p-1">
                            {([["letzte", "Letzte Kunden"], ["checkin", `Check-in (${status.offen})`]] as const).map(([wert, text]) => (
                                <button
                                    key={wert}
                                    type="button"
                                    role="radio"
                                    aria-checked={ansicht === wert}
                                    onClick={() => setAnsicht(wert)}
                                    className={cn(
                                        "h-8 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors",
                                        ansicht === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <h3 className="font-semibold">Letzte Kunden</h3>
                    )}
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => (zeigeCheckin ? queryClient.invalidateQueries({ queryKey: ["checkin"] }) : laden())}
                            disabled={isPending}
                        >
                            <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
                            Aktualisieren
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setOffen(false)} title="Schließen">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {zeigeCheckin && <CheckinListe onKundeAuswaehlen={onKundeAuswaehlen} />}

                {!zeigeCheckin && fehler && <p className="text-sm text-destructive">{fehler}</p>}
                {!zeigeCheckin && !fehler && kunden && kunden.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Kunden vorhanden.</p>}
                {!zeigeCheckin && !kunden && isPending && <p className="text-sm text-muted-foreground">Wird geladen...</p>}

                {!zeigeCheckin && kunden && kunden.length > 0 && (
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
