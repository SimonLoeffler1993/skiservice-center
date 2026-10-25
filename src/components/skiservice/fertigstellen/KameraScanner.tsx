"use client";

import { useState } from "react";
import { Camera, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import KameraServiceAktionen from "./KameraServiceAktionen";
import KameraVorschau from "./KameraVorschau";
import { QrTreffer, qrAuswerten } from "./qrAuswerten";
import ScanLeer from "./ScanLeer";
import ScanMeldung from "./ScanMeldung";
import ServiceErgebnis from "./ServiceErgebnis";
import VerleihErgebnis from "./VerleihErgebnis";

/**
 * Kamera-Modus: QR-Code des Etiketts mit Handy oder Tablet scannen.
 * Skiservice: Ski fertig stellen und/oder Bindung geprüft. Verleih: Bindung geprüft.
 * Nach einem Treffer stoppt die Kamera, "Nächsten scannen" startet sie wieder.
 */
export default function KameraScanner() {
    const [treffer, setTreffer] = useState<{ daten: QrTreffer; nr: number } | null>(null);
    const [ungueltig, setUngueltig] = useState<string | null>(null);

    function gescannt(text: string) {
        const daten = qrAuswerten(text);
        if (!daten) {
            setUngueltig(`Kein Etikett der Skiservice-App: ${text.length > 60 ? `${text.slice(0, 60)}…` : text}`);
            return;
        }
        setUngueltig(null);
        setTreffer((alt) => ({ daten, nr: (alt?.nr ?? 0) + 1 }));
    }

    const naechster = (
        <Button variant="outline" className="col-span-2 h-11 text-base sm:col-auto" onClick={() => setTreffer(null)}>
            <ScanLine className="h-5 w-5" />
            Nächsten scannen
        </Button>
    );

    return (
        // Ab lg: Kamera links, Ergebnis rechts. Darunter: Kamera oben, nach dem Treffer eingeklappt
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-start">
            <section className="space-y-3 lg:sticky lg:top-4 lg:col-span-2">
                {treffer ? (
                    <div className="hidden rounded-xl border bg-muted/30 p-4 text-center lg:block">
                        <p className="mb-3 text-sm text-muted-foreground">Kamera pausiert</p>
                        {naechster}
                    </div>
                ) : (
                    <KameraVorschau onTreffer={gescannt} />
                )}
                <ScanMeldung meldung={ungueltig ? { ok: false, text: ungueltig } : null} />
            </section>

            <section className="lg:col-span-3">
                {!treffer ? (
                    <div className="hidden lg:block">
                        <ScanLeer icon={Camera} titel="QR-Code scannen" text="Etikett vor die Kamera halten oder fotografieren. Danach Ski fertig stellen oder die Bindung als geprüft markieren." />
                    </div>
                ) : treffer.daten.art === "service" ? (
                    <ServiceErgebnis
                        key={treffer.nr}
                        auftragId={treffer.daten.id}
                        skiId={treffer.daten.skiId}
                        aktionen={(kontext) => <KameraServiceAktionen {...kontext} zusatz={naechster} />}
                    />
                ) : (
                    <VerleihErgebnis key={treffer.nr} verleihId={treffer.daten.id} materialId={treffer.daten.materialId} zusatz={naechster} />
                )}
            </section>
        </div>
    );
}
