import { useCallback, useEffect, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import useTimer from '@/hooks/useTimer';
import { auftragFertigStellen } from '@/lib/auftragaction';
import { useQueryClient } from '@tanstack/react-query';

type FertigButtonsProps = {
    serviceId: number | undefined | null;
    selectedSkiIds?: number[] | null;
};

export default function FertigButtons({ serviceId, selectedSkiIds }: FertigButtonsProps) {
    const { countdown, resetTimer, setPause } = useTimer();
    const [, startTransition] = useTransition();
    const queryClient = useQueryClient();
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
        startTransition(async () => {
            const data = await auftragFertigStellen(serviceId!, Array.from(selectedSkiIds || []));
            if (data.success) {
                // Status in Liste und Details aktualisieren
                queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
                queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", serviceId] });
            }
            // TODO: Meldung anzeeigen
        });
    }, [serviceId, selectedSkiIds, queryClient]);

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