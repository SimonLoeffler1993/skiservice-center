import { Ski } from '@/types/skiservicetypes';
import SkiDetail from '../SkiDetail';
import useAuftragSkiSelection from '@/hooks/useAuftragSkiSelection';
import { useEffect } from 'react';
import FertigButtons from './FertigButtons';
import AuswahlNachricht from './AuswahlNachricht';


type SkiListeProps = {
    skis: Ski[]
    selectedSkiIds?: number | null 
};

export default function SkiListeSelect({ skis, selectedSkiIds }: SkiListeProps) {
    const { toggleSkiSelection, getSelectedSkiIds, clearSelection } = useAuftragSkiSelection({ mode: "multi" });

    useEffect(() => {
        if (selectedSkiIds) {
            clearSelection();
            toggleSkiSelection(selectedSkiIds);
        }else {
            clearSelection();
        }
    }, [selectedSkiIds, toggleSkiSelection, clearSelection]);


    if (skis.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-10">
                <p className="text-sm text-muted-foreground">Keine Skiservice gefunden.</p>
            </div>
        );
    }

    return (
        <>
        <AuswahlNachricht selectedSkiIds={getSelectedSkiIds()} />
        <div className="space-y-1">
            <ul className="divide-y divide-border" >
                {skis.map((ski) => (
                    <li key={ski.id} className="py-3 transition-colors hover:bg-muted/40 px-2" onClick={() => toggleSkiSelection(ski.id)}>
                        <SkiDetail ski={ski} isSelected={getSelectedSkiIds().includes(ski.id)} />
                    </li>
                ))}
            </ul>
        </div>
        <FertigButtons serviceId={skis[0]?.auftrag_id} selectedSkiIds={getSelectedSkiIds()} />
        </>
    );
}