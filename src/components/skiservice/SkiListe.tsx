import { Auftrag, Ski } from '@/types/skiservicetypes';
import SkiDetail from './SkiDetail';
import SkiAktionen from './bearbeiten/SkiAktionen';

type SkiListeProps = {
    skis: Ski[]
    // Mit Angabe werden Bearbeiten-Aktionen je Ski angezeigt
    bearbeiten?: { bezahlt: boolean; kundeId: number; auftrag: Auftrag }
};

export default function SkiListe({ skis, bearbeiten }: SkiListeProps) {
    if (skis.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-10">
                <p className="text-sm text-muted-foreground">Keine Skiservices gefunden.</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <ul className="divide-y divide-border">
                {skis.map((ski) => (
                    <li key={ski.id} className="py-3 transition-colors hover:bg-muted/40 px-2">
                        <SkiDetail ski={ski} showButtons={true} kundeId={bearbeiten?.kundeId} />
                        {bearbeiten && (
                            <div className="flex justify-end">
                                <SkiAktionen ski={ski} auftrag={bearbeiten.auftrag} bezahlt={bearbeiten.bezahlt} letzterSki={skis.length === 1} kundeId={bearbeiten.kundeId} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}