import { Ski } from '@/types/skiservicetypes';
import SkiStatus from './SkiStatus';
import SkiBindung from './SkiBindung';
import SkiBindungPruefenButton from './SkiBindungPruefenButton';

type SkiDetailProps = {
    ski: Ski
    isSelected?: boolean
    showButtons?: boolean
};

export default function SkiDetail({ ski, isSelected = false, showButtons = false }: SkiDetailProps) {
    const skiPreis = ski.preis + (ski.bindung_preis ?? 0);

    return (
        <div className={`grid grid-cols-4 items-center gap-2 ${isSelected ? 'border-green-500 bg-green-50' : 'border-transparent'} rounded-lg border px-3 py-2`}>

            {/* Links: Name + Service */}
            <div className="space-y-0.5">
                <span className="block text-sm font-medium text-foreground">{ski.name}</span>
                <span className="block text-xs text-muted-foreground">{ski.service}</span>
            </div>

            {/* Mitte: Status-Badge */}
            <SkiStatus status={ski.status} />
            <SkiBindung BindungCheck={ski.bindung_check} BindungStatus={ski.bindung_status} />

            {/* Rechts: Preis */}
            <span className="text-sm font-medium text-right text-foreground tabular-nums">
                {skiPreis.toFixed(2)} €
            </span>
            {showButtons ? (
            <div className="col-span-4 flex justify-end -mt-2">
                <SkiBindungPruefenButton skiid={ski.id} auftragid={ski.auftrag_id} Check={ski.bindung_check} Status={ski.bindung_status} />
            </div>
            ): (<></>)}
        </div>
    );
}