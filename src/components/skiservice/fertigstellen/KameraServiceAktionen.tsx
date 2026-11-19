"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { auftragFertigStellen, setBindungChecked } from "@/lib/auftragaction";
import { ServiceAktionenKontext } from "./ServiceErgebnis";
import { anzahlSki, bindungOffen, istFertig } from "./skiZaehlung";

type KameraServiceAktionenProps = ServiceAktionenKontext & {
    // z.B. "Nächsten scannen"
    zusatz?: React.ReactNode;
};

// Kamera-Modus: Aktion per Button statt Countdown, Fertig und Bindung getrennt wählbar
export default function KameraServiceAktionen({ auftrag, auswahl, erledigt, zusatz }: KameraServiceAktionenProps) {
    const [laeuft, startTransition] = useTransition();
    const queryClient = useQueryClient();
    // Wie beim Hardware-Scanner: bereits fertige Ski nicht noch einmal fertig stellen
    const nichtFertig = auswahl.filter((ski) => !istFertig(ski));
    const offeneBindungen = auswahl.filter(bindungOffen);

    async function neuLaden() {
        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", auftrag.id] });
    }

    function fertigStellen() {
        startTransition(async () => {
            const antwort = await auftragFertigStellen(auftrag.id, nichtFertig.map((ski) => ski.id));
            if (!antwort.success) {
                erledigt({ ok: false, text: antwort.error ?? "Fertigstellen fehlgeschlagen" });
                return;
            }
            await neuLaden();
            erledigt({ ok: true, text: `${anzahlSki(nichtFertig.length)} fertig gestellt`, mail: antwort.mail && { status: antwort.mail, art: "fertig" } });
        });
    }

    function bindungGeprueft() {
        startTransition(async () => {
            const ok = await setBindungChecked(offeneBindungen.map((ski) => ski.id));
            if (!ok) {
                erledigt({ ok: false, text: "Bindung konnte nicht als geprüft markiert werden" });
                return;
            }
            await neuLaden();
            erledigt({ ok: true, text: `Bindung bei ${anzahlSki(offeneBindungen.length)} geprüft` });
        });
    }

    return (
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button
                className="h-11 text-sm sm:flex-1 sm:text-base"
                onClick={fertigStellen}
                disabled={nichtFertig.length === 0 || laeuft}
                title={auswahl.length > 0 && nichtFertig.length === 0 ? "Die Auswahl ist bereits fertig" : undefined}
            >
                <CheckCheck className="h-5 w-5" />
                Fertig stellen{nichtFertig.length ? ` (${nichtFertig.length})` : ""}
            </Button>
            <Button
                variant="secondary"
                className="h-11 text-sm sm:flex-1 sm:text-base"
                onClick={bindungGeprueft}
                disabled={offeneBindungen.length === 0 || laeuft}
                title={offeneBindungen.length === 0 ? "Keine offene Bindungsprüfung in der Auswahl" : undefined}
            >
                <BadgeCheck className="h-5 w-5" />
                Bindung geprüft{offeneBindungen.length ? ` (${offeneBindungen.length})` : ""}
            </Button>
            {zusatz}
        </div>
    );
}
