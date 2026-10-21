"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Ruler } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { aendereSki } from "@/lib/bearbeitenactions";
import { BindungsdatenEingabe, zuBindungsdaten, zuEingabe } from "@/types/bindungsdatentypes";
import { Ski } from "@/types/skiservicetypes";
import { useAuftragAktualisieren } from "../bearbeiten/useAuftragAktualisieren";
import BindungsdatenFelder from "./BindungsdatenFelder";

type BindungsdatenDialogProps = {
    ski: Ski;
    kundeId: number;
};

// Bindungsdaten eines Ski nachträglich erfassen oder ändern, auch bei bezahlten Aufträgen
export default function BindungsdatenDialog({ ski, kundeId }: BindungsdatenDialogProps) {
    const [offen, setOffen] = useState(false);
    const [eingabe, setEingabe] = useState<BindungsdatenEingabe>(zuEingabe(ski.bindungsdaten));
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useAuftragAktualisieren(ski.auftrag_id);
    const queryClient = useQueryClient();
    const vorhanden = !!ski.bindungsdaten;

    function speichern() {
        const { daten, fehler: eingabeFehler } = zuBindungsdaten(eingabe);
        if (eingabeFehler) {
            setFehler(eingabeFehler);
            return;
        }
        startTransition(async () => {
            // Leere Felder entfernen die Bindungsdaten
            const antwort = await aendereSki(ski.auftrag_id, ski.id, {
                bindungsdaten: daten,
                vorlage_id: daten ? eingabe.vorlage_id ?? null : null,
            });
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            aktualisieren(antwort.data);
            queryClient.invalidateQueries({ queryKey: ["bindungsdaten", kundeId] });
            setOffen(false);
        });
    }

    return (
        <Dialog
            open={offen}
            onOpenChange={(wert) => {
                setOffen(wert);
                setFehler(null);
                if (wert) setEingabe(zuEingabe(ski.bindungsdaten));
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Ruler className="h-4 w-4" />
                    {vorhanden ? "Bindungsdaten" : "Bindungsdaten erfassen"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Bindungsdaten {ski.name}</DialogTitle>
                    <DialogDescription>
                        Alle Angaben sind optional. Sind alle Felder leer, werden die Bindungsdaten entfernt.
                    </DialogDescription>
                </DialogHeader>
                <BindungsdatenFelder
                    idPrefix={`dialog-${ski.id}`}
                    wert={eingabe}
                    onChange={setEingabe}
                    kundeId={kundeId}
                />
                {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                <DialogFooter>
                    <Button type="button" onClick={speichern} disabled={isPending}>
                        {isPending ? "Speichern..." : "Speichern"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
