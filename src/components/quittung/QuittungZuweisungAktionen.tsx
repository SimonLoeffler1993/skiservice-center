"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";

import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { Button } from "@/components/ui/button";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";
import { hebeQuittungZuweisungAuf, QuittungZiel } from "@/lib/quittungactions";
import DialogQuittungZuweisen from "./DialogQuttungZuweisen";

type QuittungZuweisungAktionenProps = {
    quittungID: number;
    ziel: QuittungZiel;
};

// Von Hand zugewiesenen Lexware-Beleg korrigieren: anderen Beleg wählen oder Zuweisung aufheben
export default function QuittungZuweisungAktionen({ quittungID, ziel }: QuittungZuweisungAktionenProps) {
    const queryClient = useQueryClient();

    return (
        <div className="flex flex-wrap gap-2">
            <DialogQuittungZuweisen
                ziel={ziel}
                ersetzen={{ quittungID }}
                trigger={
                    <Button type="button" variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                        Ändern
                    </Button>
                }
            />
            <LoeschenDialog
                titel="Zuweisung aufheben"
                beschreibung="Die Zuweisung des Lexware-Belegs wird aufgehoben. Der Beleg in Lexware bleibt unverändert."
                buttonText="Zuweisung aufheben"
                onLoeschen={async () => {
                    const antwort = await hebeQuittungZuweisungAuf(ziel);
                    if (!antwort.success) return antwort.error;
                    // Detailansicht und Liste neu laden, danach ist "Quittung zuweisen" wieder da
                    if (ziel.art === "verleih") {
                        await queryClient.invalidateQueries(saisonverleihDetailsOptions(ziel.id));
                        queryClient.invalidateQueries({ queryKey: ["saisonverleihList"] });
                    } else {
                        await queryClient.invalidateQueries(auftragDetailsOptions(ziel.id));
                        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
                    }
                    return null;
                }}
            />
        </div>
    );
}
