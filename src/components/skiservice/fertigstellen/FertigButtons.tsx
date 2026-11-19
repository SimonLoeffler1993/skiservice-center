import { CheckCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { auftragFertigStellen } from '@/lib/auftragaction';
import CountdownAktion from './CountdownAktion';
import { ServiceAktionenKontext } from './ServiceErgebnis';
import { anzahlSki, istFertig } from './skiZaehlung';

// Hardware-Scanner im Modus "Fertig": noch nicht fertige Ski der Auswahl nach dem Countdown fertig stellen
export default function FertigButtons({ auftrag, auswahl, erledigt, sekunden }: ServiceAktionenKontext & { sekunden?: number }) {
    const queryClient = useQueryClient();
    // Bereits fertige oder abgeholte Ski nicht noch einmal fertig stellen
    const offen = auswahl.filter((ski) => !istFertig(ski));

    async function fertigStellen() {
        const data = await auftragFertigStellen(auftrag.id, offen.map((ski) => ski.id));
        if (!data.success) {
            erledigt({ ok: false, text: data.error ?? "Fertigstellen fehlgeschlagen" });
            return;
        }
        // Liste und Auftrag neu laden, damit der neue Status angezeigt wird
        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", auftrag.id] });
        erledigt({
            ok: true,
            text: `${anzahlSki(offen.length)} fertig gestellt`,
            mail: data.mail && { status: data.mail, art: "fertig" },
        });
    }

    return (
        <div className="space-y-2">
            {auswahl.length > 0 && offen.length === 0 && (
                <p className="text-sm text-muted-foreground">{auswahl.length === 1 ? "Ski ist bereits fertig." : "Die ausgewählten Ski sind bereits fertig."}</p>
            )}
            <CountdownAktion
                schluessel={offen.map((ski) => ski.id).join(",")}
                text="Fertigstellen"
                laeuftText="Wird fertig gestellt..."
                icon={CheckCheck}
                ausfuehren={fertigStellen}
                sekunden={sekunden}
            />
        </div>
    );
}
