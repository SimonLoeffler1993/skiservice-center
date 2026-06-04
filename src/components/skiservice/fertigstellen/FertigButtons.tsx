import { useCallback, useEffect, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import useTimer from '@/hooks/useTimer';
import { auftragFertigStellen } from '@/lib/auftragaction';

type FertigButtonsProps = {
    serviceId: number | undefined | null;
    selectedSkiIds?: number[] | null;
};

export default function FertigButtons({ serviceId, selectedSkiIds }: FertigButtonsProps) {
    const { countdown, resetTimer, setPause } = useTimer();
    const [isPending, startTransition] = useTransition();
    const isButtonDisabled = !selectedSkiIds || selectedSkiIds.length === 0;

    const skiIdsKey = selectedSkiIds;

    useEffect(() => {
        if (isButtonDisabled) {
            setPause(true);
            return;
        }

        setPause(false);
        resetTimer();
    }, [skiIdsKey, resetTimer, setPause, isButtonDisabled]); // resetTimer als Dependency hinzufügen

    const handleFertigstellen = useCallback(() => {
        // Hier kannst du die Logik zum Fertigstellen des Services hinzufügen, z.B. eine API-Anfrage senden
        console.log("Fertigstellen mit Service ID:", serviceId, "und ausgewählten Ski IDs:", Array.from(selectedSkiIds || []));
        startTransition(async () => {
            const data = await auftragFertigStellen(serviceId!, Array.from(selectedSkiIds || []));
            console.log("Fertigstellen abgeschlossen:", data);
            // TODO: Meldung anzeeigen
        });
    }, [serviceId, selectedSkiIds]);

    useEffect(() => {
        if (countdown === 0) {
            handleFertigstellen();
        }
    }, [countdown, handleFertigstellen]);


    if (!serviceId) {   
        return null; 
    }

    

    return (
        <div className="flex gap-4">
            <Button className="flex-1" onClick={handleFertigstellen} disabled={isButtonDisabled}>
                Fertigstellen in {countdown}
            </Button>
            <Button className="flex-1" onClick={() => setPause(true)} variant="outline" disabled={isButtonDisabled}>
                Abbrechen
            </Button>
        </div>
    );
}