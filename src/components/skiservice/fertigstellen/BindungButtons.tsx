import { BadgeCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { setBindungChecked } from "@/lib/auftragaction";
import CountdownAktion from "./CountdownAktion";
import { ServiceAktionenKontext } from "./ServiceErgebnis";
import { anzahlSki, bindungOffen } from "./skiZaehlung";

// Hardware-Scanner im Modus "Bindung": offene Bindungsprüfungen der Auswahl nach dem Countdown als geprüft markieren
export default function BindungButtons({ auftrag, auswahl, erledigt, sekunden }: ServiceAktionenKontext & { sekunden?: number }) {
    const queryClient = useQueryClient();
    const offen = auswahl.filter(bindungOffen);

    async function bindungGeprueft() {
        const { ok, mail } = await setBindungChecked(offen.map((ski) => ski.id));
        if (!ok) {
            erledigt({ ok: false, text: "Bindung konnte nicht als geprüft markiert werden" });
            return;
        }
        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", auftrag.id] });
        erledigt({ ok: true, text: `Bindung bei ${anzahlSki(offen.length)} geprüft`, mail: mail && { status: mail, art: "fertig" } });
    }

    // Nichts zu prüfen: sagen warum, statt nur den Button zu sperren
    function nichtsOffen() {
        if (auswahl.length > 1) return "Keine offene Bindungsprüfung in der Auswahl.";
        return auswahl[0].bindung_check ? "Bindung ist bereits geprüft." : "Kein Bindungscheck beauftragt.";
    }

    return (
        <div className="space-y-2">
            {auswahl.length > 0 && offen.length === 0 && (
                <p className="text-sm text-muted-foreground">{nichtsOffen()}</p>
            )}
            <CountdownAktion
                schluessel={offen.map((ski) => ski.id).join(",")}
                text="Bindung geprüft"
                laeuftText="Wird gespeichert..."
                icon={BadgeCheck}
                ausfuehren={bindungGeprueft}
                sekunden={sekunden}
            />
        </div>
    );
}
