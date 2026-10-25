import { useCallback, useEffect, useTransition } from 'react';
import { CheckCheck, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import useTimer from '@/hooks/useTimer';
import { auftragFertigStellen } from '@/lib/auftragaction';
import { Meldung } from './ScanMeldung';

type FertigButtonsProps = {
    serviceId: number;
    selectedSkiIds: number[];
    onErledigt: (meldung: Meldung) => void;
};

// Hardware-Scanner: ausgewählte Ski nach 10 s Countdown fertig stellen, Abbrechen hält den Countdown an
export default function FertigButtons({ serviceId, selectedSkiIds, onErledigt }: FertigButtonsProps) {
    const { countdown, pause, resetTimer, setPause } = useTimer();
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();
    const isButtonDisabled = selectedSkiIds.length === 0 || isPending;
    const skiIdsKey = selectedSkiIds.join(",");

    useEffect(() => {
        if (skiIdsKey === "") {
            setPause(true);
            return;
        }
        setPause(false);
        resetTimer();
    }, [skiIdsKey, resetTimer, setPause]);

    const handleFertigstellen = useCallback(() => {
        setPause(true);
        startTransition(async () => {
            const data = await auftragFertigStellen(serviceId, selectedSkiIds);
            if (data.success) {
                // Status in Liste und Details aktualisieren
                queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
                await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", serviceId] });
                onErledigt({ ok: true, text: `${selectedSkiIds.length === 1 ? "Ski" : `${selectedSkiIds.length} Ski`} fertig gestellt` });
            } else {
                onErledigt({ ok: false, text: data.error ?? "Fertigstellen fehlgeschlagen" });
            }
        });
    }, [serviceId, selectedSkiIds, queryClient, onErledigt, setPause]);

    useEffect(() => {
        if (countdown === 0 && skiIdsKey !== "") {
            handleFertigstellen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);

    const laeuft = !pause && !isButtonDisabled;

    return (
        <div className="flex gap-2">
            <Button className="h-11 flex-1 text-base" onClick={handleFertigstellen} disabled={isButtonDisabled}>
                <CheckCheck className="h-5 w-5" />
                {isPending ? "Wird fertig gestellt..." : laeuft ? `Fertigstellen in ${countdown} s` : "Fertigstellen"}
            </Button>
            <Button className="h-11 flex-1 text-base sm:flex-none sm:px-6" onClick={() => setPause(true)} variant="outline" disabled={!laeuft}>
                <X className="h-5 w-5" />
                Abbrechen
            </Button>
        </div>
    );
}
