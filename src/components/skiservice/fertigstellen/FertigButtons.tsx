import { CheckCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { auftragFertigStellen } from '@/lib/auftragaction';
import CountdownAktion from './CountdownAktion';
import { Meldung } from './ScanMeldung';

type FertigButtonsProps = {
    serviceId: number;
    selectedSkiIds: number[];
    onErledigt: (meldung: Meldung) => void;
};

// Hardware-Scanner: ausgewählte Ski nach 10 s Countdown fertig stellen, Abbrechen hält den Countdown an
export default function FertigButtons({ serviceId, selectedSkiIds, onErledigt }: FertigButtonsProps) {
    const queryClient = useQueryClient();

    async function fertigStellen() {
        const data = await auftragFertigStellen(serviceId, selectedSkiIds);
        if (!data.success) {
            onErledigt({ ok: false, text: data.error ?? "Fertigstellen fehlgeschlagen" });
            return;
        }
        // Status in Liste und Details aktualisieren
        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", serviceId] });
        onErledigt({
            ok: true,
            text: `${selectedSkiIds.length === 1 ? "Ski" : `${selectedSkiIds.length} Ski`} fertig gestellt`,
            mail: data.mail && { status: data.mail, art: "fertig" },
        });
    }

    return (
        <CountdownAktion
            schluessel={selectedSkiIds.join(",")}
            text="Fertigstellen"
            laeuftText="Wird fertig gestellt..."
            icon={CheckCheck}
            ausfuehren={fertigStellen}
        />
    );
}
