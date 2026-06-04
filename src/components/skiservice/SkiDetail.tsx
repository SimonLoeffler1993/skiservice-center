import { Ski } from '@/types/skiservicetypes';
import SkiStatus from './SkiStatus';
import SkiBindung from './SkiBindung';

type SkiDetailProps = {
    ski: Ski
    isSelected?: boolean
};

export default function SkiDetail({ ski, isSelected = false }: SkiDetailProps) {
    const skiPreis = parseFloat(ski.preis) + (ski.bindung_preis ?? 0);

    return (
        <div className={`grid grid-cols-4 items-center gap-4 ${isSelected ? 'border-green-500 bg-green-50' : 'border-transparent'} rounded-lg border px-3 py-2`}>

            {/* Links: Name + Service */}
            <div className="space-y-0.5">
                <span className="block text-sm font-medium text-foreground">{ski.name}</span>
                <span className="block text-xs text-muted-foreground">{ski.service}</span>
            </div>

            {/* Mitte: Status-Badge */}
            <SkiStatus status={ski.status} />
            <SkiBindung BindungCheck={ski.bindung_check} BindungStatus={ski.bindung_status} />

            {/* Rechts: Preis */}
            <span className="text-sm font-medium text-foreground tabular-nums">
                {skiPreis.toFixed(2)} €
            </span>

        </div>
    );
}