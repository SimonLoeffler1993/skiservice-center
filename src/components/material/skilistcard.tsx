"use client"
import { useState } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ModellArray, Ski } from "@/types/materialtypes";
import { aendereSkiMaterial } from "@/lib/materialbearbeitenactions";
import FeldDialog, { FeldWerte, zahlAus } from "./bearbeiten/FeldDialog";
import MaterialAktionen, { AusgemustertBadge } from "./bearbeiten/MaterialAktionen";

type SkiLIstCardProps = {
    ski: Ski
    modelle: ModellArray
    onGeaendert: () => void
}

export default function SkiListCard({ ski, modelle, onGeaendert }: SkiLIstCardProps) {
    const [meldung, setMeldung] = useState<string | null>(null);
    const formatEUR = (n: number) =>
        new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

    async function speichern(werte: FeldWerte): Promise<string | null> {
        const antwort = await aendereSkiMaterial(ski.ID, {
            Modell_ID: Number(werte.Modell_ID),
            SkiNr: String(werte.SkiNr),
            Laenge: zahlAus(werte.Laenge) ?? undefined,
            Saison: String(werte.Saison),
            EK: zahlAus(werte.EK) ?? undefined,
            VK: zahlAus(werte.VK) ?? undefined,
        });
        if (!antwort.success) return antwort.error;
        const anzahl = antwort.data.UmgestellteVerleihe;
        setMeldung(anzahl > 0 ? `Ski-Nr. geändert, ${anzahl} ${anzahl === 1 ? "Verleih" : "Verleihe"} umgestellt.` : null);
        onGeaendert();
        return null;
    }

    const bearbeiten = (
        <FeldDialog
            titel={`Ski ${ski.SkiNr} bearbeiten`}
            startwerte={{
                Modell_ID: String(ski.Modell_ID),
                SkiNr: ski.SkiNr,
                Laenge: String(ski.Laenge),
                Saison: ski.Saison,
                EK: String(ski.EK),
                VK: String(ski.VK),
            }}
            felder={[
                {
                    name: "Modell_ID", label: "Modell", typ: "auswahl",
                    optionen: modelle.map((m) => ({ wert: String(m.ID), text: `${m.Hersteller.Name} ${m.Modell}` })),
                },
                {
                    name: "SkiNr", label: "Ski-Nr.",
                    hinweis: ski.ImVerleih
                        ? "Bestehende Verleihe werden auf die neue Nummer umgestellt. Bereits gedruckte Etiketten zeigen noch die alte Nummer."
                        : undefined,
                },
                { name: "Laenge", label: "Länge (cm)", typ: "zahl" },
                { name: "Saison", label: "Saison" },
                { name: "EK", label: "EK (€)", typ: "zahl" },
                { name: "VK", label: "VK (€)", typ: "zahl" },
            ]}
            onSpeichern={speichern}
        />
    );

    return (
        <Card className={`hover:shadow-md transition-shadow ${ski.Ausgemustert ? "opacity-60" : ""}`}>
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                    {ski.Modell.Modell}
                    {ski.Ausgemustert && <AusgemustertBadge />}
                </CardTitle>
                <CardDescription>{ski.Modell.Hersteller.Name} • {ski.Modell.Art.Art}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Länge</div>
                    <div className="text-right">{ski.Laenge} cm</div>
                    <div className="text-muted-foreground">Ski-Nr.</div>
                    <div className="text-right">{ski.SkiNr}</div>
                    <div className="text-muted-foreground">EK</div>
                    <div className="text-right">{formatEUR(ski.EK)}</div>
                    <div className="text-muted-foreground">VK</div>
                    <div className="text-right font-medium">{formatEUR(ski.VK)}</div>
                </div>
                {meldung && <p className="text-xs text-green-700">{meldung}</p>}
            </CardContent>
            <CardFooter className="flex-wrap justify-between gap-2">
                <div className="text-sm text-muted-foreground">Saison {ski.Saison}</div>
                <MaterialAktionen
                    art="ski"
                    id={ski.ID}
                    bezeichnung={`Ski ${ski.SkiNr}`}
                    ausgemustert={ski.Ausgemustert}
                    bearbeiten={bearbeiten}
                    onGeaendert={onGeaendert}
                />
            </CardFooter>
        </Card>
    )
}
