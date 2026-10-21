"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { aendereSki, entferneSki } from "@/lib/bearbeitenactions";
import { Ski } from "@/types/skiservicetypes";
import SkiFormDialog from "./SkiFormDialog";
import { useAuftragAktualisieren } from "./useAuftragAktualisieren";

type SkiAktionenProps = {
    ski: Ski;
    bezahlt: boolean;
    // Der letzte Ski kann nicht entfernt werden
    letzterSki: boolean;
    kundeId: number;
};

export default function SkiAktionen({ ski, bezahlt, letzterSki, kundeId }: SkiAktionenProps) {
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useAuftragAktualisieren(ski.auftrag_id);
    const queryClient = useQueryClient();
    const istFertig = ski.status === 1;

    function statusUmschalten() {
        startTransition(async () => {
            const antwort = await aendereSki(ski.auftrag_id, ski.id, { status: istFertig ? 0 : 1 });
            if (antwort.success) {
                aktualisieren(antwort.data);
                queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
            }
        });
    }

    return (
        <div className="flex items-center gap-1">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={statusUmschalten}
                disabled={isPending}
                title={istFertig ? "Wieder auf offen setzen" : "Als fertig markieren (ohne Mail)"}
            >
                {istFertig ? <RotateCcw className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </Button>
            <SkiFormDialog auftragId={ski.auftrag_id} ski={ski} bezahlt={bezahlt} kundeId={kundeId} />
            <LoeschenDialog
                titel={`Ski ${ski.name ?? ""} entfernen`}
                beschreibung="Der Ski wird aus dem Auftrag entfernt."
                deaktiviert={bezahlt || letzterSki}
                deaktiviertGrund={bezahlt ? "Auftrag ist bezahlt" : "Letzter Ski, bitte den Auftrag löschen"}
                onLoeschen={async () => {
                    const antwort = await entferneSki(ski.auftrag_id, ski.id);
                    if (!antwort.success) return antwort.error;
                    aktualisieren(antwort.data);
                    queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
                    return null;
                }}
            />
        </div>
    );
}
