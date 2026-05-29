import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import useTimer from '@/hooks/useTimer';

type FertigButtonsProps = {
    serviceId: number | undefined | null;
    selectedSkiIds?: number[] | null;
};

export default function FertigButtons({ serviceId, selectedSkiIds }: FertigButtonsProps) {
    const { countdown, resetTimer } = useTimer();
    const isButtonDisabled = !selectedSkiIds || selectedSkiIds.length === 0;

    const skiIdsKey = selectedSkiIds

    useEffect(() => {
        resetTimer();
    }, [skiIdsKey, resetTimer]); // resetTimer als Dependency hinzufügen

    console.log("Selected Ski IDs in FertigButtons:", selectedSkiIds);

    if (!serviceId) {   
        return null; 
    }

    function handleFertigstellen() {
        // Hier kannst du die Logik zum Fertigstellen des Services hinzufügen, z.B. eine API-Anfrage senden
        console.log("Fertigstellen mit Service ID:", serviceId, "und ausgewählten Ski IDs:", Array.from(selectedSkiIds || []));
    }

    return (
        <div className="flex gap-4">
            <Button className="flex-1" onClick={handleFertigstellen} disabled={isButtonDisabled}>
                Fertigstellen in {countdown}
            </Button>
            <Button className="flex-1" variant="outline" disabled={isButtonDisabled}>
                Abbrechen
            </Button>
        </div>
    );
}