import { BadgeCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { setBindungChecked } from "@/lib/auftragaction";
import CountdownAktion from "./CountdownAktion";
import { ServiceAktionenKontext } from "./ServiceErgebnis";

// Hardware-Scanner im Modus "Bindung": offene Bindungsprüfungen der Auswahl nach 10 s Countdown als geprüft markieren
export default function BindungButtons({ auftrag, auswahl, erledigt }: ServiceAktionenKontext) {
    const queryClient = useQueryClient();
    const offen = auswahl.filter((ski) => ski.bindung_check && !ski.bindung_status);

    async function bindungGeprueft() {
        const ok = await setBindungChecked(offen.map((ski) => ski.id));
        if (!ok) {
            erledigt({ ok: false, text: "Bindung konnte nicht als geprüft markiert werden" });
            return;
        }
        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", auftrag.id] });
        erledigt({ ok: true, text: `Bindung bei ${offen.length === 1 ? "Ski" : `${offen.length} Ski`} geprüft` });
    }

    return (
        <div className="space-y-2">
            {auswahl.length > 0 && offen.length === 0 && (
                <p className="text-sm text-muted-foreground">Keine offene Bindungsprüfung in der Auswahl.</p>
            )}
            <CountdownAktion
                schluessel={offen.map((ski) => ski.id).join(",")}
                text="Bindung geprüft"
                laeuftText="Wird gespeichert..."
                icon={BadgeCheck}
                ausfuehren={bindungGeprueft}
            />
        </div>
    );
}
