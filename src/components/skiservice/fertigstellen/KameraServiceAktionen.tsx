"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { auftragFertigStellen, setBindungChecked } from "@/lib/auftragaction";
import { ServiceAktionenKontext } from "./ServiceErgebnis";

type KameraServiceAktionenProps = ServiceAktionenKontext & {
    // z.B. "Nächsten scannen"
    zusatz?: React.ReactNode;
};

function anzahlText(anzahl: number) {
    return anzahl === 1 ? "Ski" : `${anzahl} Ski`;
}

// Kamera-Modus: Aktion per Button statt Countdown, Fertig und Bindung getrennt wählbar
export default function KameraServiceAktionen({ auftrag, auswahl, erledigt, zusatz }: KameraServiceAktionenProps) {
    const [laeuft, startTransition] = useTransition();
    const queryClient = useQueryClient();
    const offeneBindungen = auswahl.filter((ski) => ski.bindung_check && !ski.bindung_status);

    async function neuLaden() {
        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", auftrag.id] });
    }

    function fertigStellen() {
        startTransition(async () => {
            const antwort = await auftragFertigStellen(auftrag.id, auswahl.map((ski) => ski.id));
            if (!antwort.success) {
                erledigt({ ok: false, text: antwort.error ?? "Fertigstellen fehlgeschlagen" });
                return;
            }
            await neuLaden();
            erledigt({ ok: true, text: `${anzahlText(auswahl.length)} fertig gestellt` });
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
            erledigt({ ok: true, text: `Bindung bei ${anzahlText(offeneBindungen.length)} geprüft` });
        });
    }

    return (
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button className="h-11 text-sm sm:flex-1 sm:text-base" onClick={fertigStellen} disabled={auswahl.length === 0 || laeuft}>
                <CheckCheck className="h-5 w-5" />
                Fertig stellen{auswahl.length ? ` (${auswahl.length})` : ""}
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
