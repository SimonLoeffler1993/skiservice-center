"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { Auftrag, Ski } from "@/types/skiservicetypes";
import { AuftragBezahlt } from "../anzeigen/AuftragBezahlt";
import { AuftragStatus } from "../anzeigen/AuftragStatus";
import ScanMeldung, { Meldung } from "./ScanMeldung";
import SkiAuswahlZeile from "./SkiAuswahlZeile";

export type ServiceAktionenKontext = {
    auftrag: Auftrag;
    auswahl: Ski[];
    // Nach einer Aktion: Meldung anzeigen und Auswahl leeren
    erledigt: (meldung: Meldung) => void;
    melden: (meldung: Meldung) => void;
};

type ServiceErgebnisProps = {
    auftragId: number;
    // Gescannter Ski, ist vorausgewählt
    skiId?: number | null;
    // Buttons der Aktionsleiste, je nach Modus (Countdown beim Hardware-Scanner, Buttons bei der Kamera)
    aktionen: (kontext: ServiceAktionenKontext) => React.ReactNode;
};

// Gescannter Auftrag: Kopf mit Kunde und Status, Ski zum Auswählen, Aktionsleiste
// Wird pro Scan neu eingehängt (key), damit die Auswahl zurückgesetzt wird
export default function ServiceErgebnis({ auftragId, skiId, aktionen }: ServiceErgebnisProps) {
    // Beim Scan immer frisch laden, der Status kann sich geändert haben
    const { data, isPending, error } = useQuery({ ...auftragDetailsOptions(auftragId), staleTime: 0 });
    const [ausgewaehlt, setAusgewaehlt] = useState<number[]>(skiId ? [skiId] : []);
    const [meldung, setMeldung] = useState<Meldung | null>(null);

    if (isPending) {
        return (
            <p className="flex items-center gap-2 rounded-xl border p-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Auftrag wird geladen...
            </p>
        );
    }
    if (error || !data?.data) {
        return <ScanMeldung meldung={{ ok: false, text: error?.message ?? `Auftrag ${auftragId} nicht gefunden` }} />;
    }

    const auftrag = data.data;
    const kunde = auftrag.kunde;
    const auswahl = auftrag.skis.filter((ski) => ausgewaehlt.includes(ski.id));

    function umschalten(id: number) {
        setAusgewaehlt((liste) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]));
    }

    return (
        <div className="space-y-4">
            {/* Kopf: Nummer, Kunde, Status */}
            <section className="flex flex-wrap items-start justify-between gap-3 rounded-xl border bg-card p-4 sm:p-5">
                <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Skiservice</p>
                    <p className="text-2xl font-bold tracking-tight">{auftrag.name ?? `Auftrag #${auftrag.id}`}</p>
                    <p className="text-muted-foreground">
                        {[kunde.Vorname, kunde.Nachname].filter(Boolean).join(" ")}
                        {kunde.Handy || kunde.Tel ? ` · ${kunde.Handy || kunde.Tel}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <AuftragStatus status={auftrag.wie} />
                        <AuftragBezahlt bezahlt={auftrag.bezahlt} />
                    </div>
                </div>
                <Button asChild variant="outline" className="h-10">
                    <Link href={`/skiservice/anzeigen/${auftrag.id}${skiId ? `?ski=${skiId}` : ""}`}>
                        <ExternalLink className="h-4 w-4" />
                        Öffnen
                    </Link>
                </Button>
            </section>

            {/* Ski zum Auswählen */}
            <section className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold">Ski ({auftrag.skis.length})</h2>
                    <p className="text-sm text-muted-foreground">
                        {auswahl.length > 0 ? `${auswahl.length} ausgewählt` : "Ski antippen zum Auswählen"}
                    </p>
                </div>
                <div className="space-y-2">
                    {auftrag.skis.map((ski) => (
                        <SkiAuswahlZeile key={ski.id} ski={ski} ausgewaehlt={ausgewaehlt.includes(ski.id)} onUmschalten={() => umschalten(ski.id)} />
                    ))}
                </div>
            </section>

            {/* Aktionsleiste: auf Handy und Tablet unten angeheftet */}
            <div className="sticky bottom-0 -mx-4 space-y-2 border-t bg-background/95 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
                <ScanMeldung meldung={meldung} />
                {aktionen({
                    auftrag,
                    auswahl,
                    erledigt: (neu) => {
                        setMeldung(neu);
                        if (neu.ok) setAusgewaehlt([]);
                    },
                    melden: setMeldung,
                })}
            </div>
        </div>
    );
}
