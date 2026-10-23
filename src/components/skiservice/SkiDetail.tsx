import { Ski } from '@/types/skiservicetypes';
import SkiStatus from './SkiStatus';
import SkiBindung from './SkiBindung';
import SkiBindungPruefenButton from './SkiBindungPruefenButton';
import { bindungsdatenText } from '@/types/bindungsdatentypes';
import BindungsdatenDialog from './bindung/BindungsdatenDialog';

type SkiDetailProps = {
    ski: Ski
    isSelected?: boolean
    showButtons?: boolean
    // Mit Angabe können die Bindungsdaten direkt bearbeitet werden
    kundeId?: number
};

export default function SkiDetail({ ski, isSelected = false, showButtons = false, kundeId }: SkiDetailProps) {
    const skiPreis = ski.preis + (ski.bindung_preis ?? 0);
    const bindungText = ski.bindung_check ? bindungsdatenText(ski.bindungsdaten) : null;

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-4 items-center gap-2 ${isSelected ? 'border-green-500 bg-green-50' : 'border-transparent'} rounded-lg border px-3 py-2`}>

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
            {bindungText && (
                <p className="col-span-2 sm:col-span-4 text-xs text-muted-foreground" title="Bindungsdaten">
                    Bindung: {bindungText}
                </p>
            )}
            {showButtons ? (
            <div className="col-span-2 sm:col-span-4 flex flex-wrap justify-end gap-2 sm:-mt-2">
                {ski.bindung_check && kundeId !== undefined && <BindungsdatenDialog ski={ski} kundeId={kundeId} />}
                <SkiBindungPruefenButton skiid={ski.id} auftragid={ski.auftrag_id} Check={ski.bindung_check} Status={ski.bindung_status} />
            </div>
            ): (<></>)}
        </div>
    );
}