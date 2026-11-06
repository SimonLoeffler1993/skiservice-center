"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { TriangleAlert } from "lucide-react";

import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { Button } from "@/components/ui/button";
import { checkinListeOptions } from "@/hooks/useCheckinOptions";
import { uebernehmeCheckin, verwerfeCheckin } from "@/lib/checkinactions";
import { cn } from "@/lib/utils";
import { Checkin } from "@/types/checkintypes";
import { Kunde } from "@/types/skikundentypes";

function checkinName(checkin: Checkin) {
    return [checkin.kunde?.Nachname, checkin.kunde?.Vorname].filter((teil) => teil?.trim()).join(", ") || "–";
}

function checkinDetails(checkin: Checkin) {
    const kunde = checkin.kunde;
    const ort = [kunde?.Plz, kunde?.Ort].filter(Boolean).join(" ");
    return [kunde?.Strasse, ort, kunde?.Handy || kunde?.Tel, kunde?.Email].filter((teil) => teil?.trim()).join(" · ");
}

// Offene Check-ins aus der Zwischendatenbank, Aufbau wie "Letzte Kunden". Auswählen kopiert den Kunden in die richtige Datenbank.
export default function CheckinListe({ onKundeAuswaehlen }: { onKundeAuswaehlen: (kunde: Kunde) => void }) {
    const queryClient = useQueryClient();
    const { data: checkins, error, isPending: laedt } = useQuery(checkinListeOptions);
    const [auswahl, setAuswahl] = useState<string | null>(null);
    const [fehler, setFehler] = useState<string | null>(null);
    // Kunde ist angelegt, aber es gibt einen Hinweis: erst nach dem Lesen weiter
    const [hinweis, setHinweis] = useState<{ text: string; kunde: Kunde } | null>(null);
    const [isPending, startTransition] = useTransition();

    const lesbar = checkins?.filter((checkin) => checkin.lesbar) ?? [];
    // Neuester vorausgewählt, bis etwas anderes gewählt wird
    const ausgewaehlt = lesbar.find((checkin) => checkin.id === auswahl) ?? lesbar[0] ?? null;

    function aktualisieren() {
        return queryClient.invalidateQueries({ queryKey: ["checkin"] });
    }

    function uebernehmen(checkin: Checkin) {
        startTransition(async () => {
            const antwort = await uebernehmeCheckin(checkin.id);
            await aktualisieren();
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setFehler(null);
            if (antwort.data.warnung) {
                setHinweis({ text: antwort.data.warnung, kunde: antwort.data.kunde });
                return;
            }
            onKundeAuswaehlen(antwort.data.kunde);
        });
    }

    async function verwerfen(checkin: Checkin): Promise<string | null> {
        const antwort = await verwerfeCheckin(checkin.id);
        await aktualisieren();
        return antwort.success ? null : antwort.error;
    }

    if (hinweis) {
        return (
            <div className="space-y-3">
                <p className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {hinweis.text}
                </p>
                <div className="flex justify-end">
                    <Button type="button" onClick={() => onKundeAuswaehlen(hinweis.kunde)}>Weiter</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {error && <p className="text-sm text-destructive">{error.message}</p>}
            {fehler && <p className="text-sm text-destructive">{fehler}</p>}
            {laedt && <p className="text-sm text-muted-foreground">Wird geladen...</p>}
            {checkins?.length === 0 && <p className="text-sm text-muted-foreground">Keine offenen Check-ins.</p>}

            {checkins && checkins.length > 0 && (
                <>
                    <div role="radiogroup" aria-label="Check-ins" className="space-y-2">
                        {checkins.map((checkin) => {
                            const aktiv = checkin.id === ausgewaehlt?.id;
                            return (
                                <div key={checkin.id} className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={aktiv}
                                        disabled={!checkin.lesbar}
                                        onClick={() => setAuswahl(checkin.id)}
                                        // Doppelklick übernimmt direkt
                                        onDoubleClick={() => !isPending && uebernehmen(checkin)}
                                        className={cn(
                                            "flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                                            aktiv ? "border-primary bg-primary/5" : checkin.lesbar && "hover:bg-muted",
                                        )}
                                    >
                                        {checkin.lesbar ? (
                                            <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", aktiv ? "border-primary" : "border-muted-foreground/40")}>
                                                {aktiv && <span className="h-2 w-2 rounded-full bg-primary" />}
                                            </span>
                                        ) : (
                                            <TriangleAlert className="h-4 w-4 shrink-0 text-destructive" />
                                        )}
                                        <span className="min-w-0 flex-1">
                                            <span className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold">{checkin.lesbar ? checkinName(checkin) : "Nicht lesbar"}</span>
                                                <span className="text-xs text-muted-foreground">{format(parseISO(checkin.erstellt_am), "dd.MM. HH:mm")}</span>
                                            </span>
                                            <span className="block truncate text-sm text-muted-foreground">
                                                {checkin.lesbar ? checkinDetails(checkin) || "Keine weiteren Angaben" : checkin.grund}
                                            </span>
                                        </span>
                                    </button>
                                    <LoeschenDialog
                                        titel="Check-in verwerfen?"
                                        beschreibung="Der Datensatz wird endgültig aus der Check-in-Datenbank gelöscht, ohne dass ein Kunde angelegt wird."
                                        onLoeschen={() => verwerfen(checkin)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end">
                        <Button type="button" onClick={() => ausgewaehlt && uebernehmen(ausgewaehlt)} disabled={!ausgewaehlt || isPending}>
                            {isPending ? "Wird übernommen..." : "Übernehmen"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
