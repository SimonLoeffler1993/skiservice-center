import { Ski } from '@/types/skiservicetypes';
import SkiDetail from './SkiDetail';

type SkiListeProps = {
    skis: Ski[]
};

export default function SkiListe({ skis }: SkiListeProps) {
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
                        <SkiDetail ski={ski} />
                    </li>
                ))}
            </ul>
        </div>
    );
}