"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Kunde, SkiSuchKunde } from "@/types/skikundentypes";
import KundeErfassenDialog from "@/components/kunde/KundeErfassenDialog";
import KundenTabelle from "./KundenTabelle";

type KundeSuchErgebnisseTabelleProps = {
    daten: Kunde[] | null;
    // Suchbegriffe, zur Vorbelegung beim Neuanlegen
    suche?: SkiSuchKunde;
    onKundeAuswaehlen?: (kunde: Kunde) => void;
};

export default function KundeSuchErgebnisseTabelle({ daten, suche, onKundeAuswaehlen }: KundeSuchErgebnisseTabelleProps) {
    // Was mit der Auswahl passiert (z.B. in den Kunden-Store übernehmen), entscheidet die Suche
    function auswaehlen(kunde: Kunde) {
        onKundeAuswaehlen?.(kunde);
    }

    // Neu angelegter Kunde wird genauso übernommen wie ein gefundener
    const neuAnlegen = (hervorheben: boolean) => (
        <KundeErfassenDialog
            vorname={suche?.Vorname?.trim()}
            nachname={suche?.Nachname?.trim()}
            onGespeichert={auswaehlen}
            hervorheben={hervorheben}
        />
    );

    if (!daten || daten.length === 0) {
        return (
            <div className="mt-6 flex flex-col items-start gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground">Kein Kunde gefunden.</p>
                {neuAnlegen(true)}
            </div>
        );
    }

    return (
        <Card className="mt-6">
            <CardContent className="space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">Gefundene Kunden ({daten.length})</h3>
                    <p className="text-sm text-muted-foreground">Zum Auswählen anklicken</p>
                </div>

                <KundenTabelle kunden={daten} onAuswaehlen={auswaehlen} />

                <div className="border-t pt-3">{neuAnlegen(false)}</div>
            </CardContent>
        </Card>
    );
}
