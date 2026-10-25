import { Mountain } from 'lucide-react';

import { Auftrag } from '@/types/skiservicetypes';
import SkiKarte from './SkiKarte';

type SkiListeProps = {
    auftrag: Auftrag;
    bezahlt: boolean;
    // Ski-ID aus dem QR-Code
    hervorheben?: number;
};

// Ski eines Auftrags als Karten, Spaltenzahl nach Breite des Hauptbereichs
export default function SkiListe({ auftrag, bezahlt, hervorheben }: SkiListeProps) {
    const { skis } = auftrag;

    return (
        <section className="@container space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Mountain className="h-5 w-5 text-muted-foreground" />
                Ski ({skis.length})
            </h2>

            {skis.length === 0 ? (
                <p className="rounded-xl border p-4 text-muted-foreground">Keine Skiservices gefunden.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                    {skis.map((ski) => (
                        <SkiKarte key={ski.id} ski={ski} auftrag={auftrag} bezahlt={bezahlt} letzterSki={skis.length === 1} hervorgehoben={ski.id === hervorheben} />
                    ))}
                </div>
            )}
        </section>
    );
}
