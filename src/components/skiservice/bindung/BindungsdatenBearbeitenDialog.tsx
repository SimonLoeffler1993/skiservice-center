"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Ruler } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bindungsdaten, BindungsdatenEingabe, zuBindungsdaten, zuEingabe } from "@/types/bindungsdatentypes";
import BindungsdatenFelder from "./BindungsdatenFelder";

type BindungsdatenBearbeitenDialogProps = {
    // z.B. "26/27S1-1" oder "Mia"
    titel: string;
    idPrefix: string;
    bindungsdaten: Bindungsdaten | null | undefined;
    kundeId: number;
    // Vorbelegung, wenn noch keine Bindungsdaten vorhanden sind
    vorschlag?: Partial<BindungsdatenEingabe>;
    // null entfernt die Bindungsdaten. Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onSpeichern: (daten: Bindungsdaten | null, vorlageId: number | null) => Promise<string | null>;
};

// Bindungsdaten nachträglich erfassen oder ändern, für Service-Ski und Verleih-Material
export default function BindungsdatenBearbeitenDialog({ titel, idPrefix, bindungsdaten, kundeId, vorschlag, onSpeichern }: BindungsdatenBearbeitenDialogProps) {
    const startwerte = () => (bindungsdaten ? zuEingabe(bindungsdaten) : { ...zuEingabe(null), ...vorschlag });
    const [offen, setOffen] = useState(false);
    const [eingabe, setEingabe] = useState<BindungsdatenEingabe>(startwerte);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();

    function speichern() {
        const { daten, fehler: eingabeFehler } = zuBindungsdaten(eingabe);
        if (eingabeFehler) {
            setFehler(eingabeFehler);
            return;
        }
        startTransition(async () => {
            // Leere Felder entfernen die Bindungsdaten
            const ergebnis = await onSpeichern(daten, daten ? eingabe.vorlage_id ?? null : null);
            if (ergebnis) {
                setFehler(ergebnis);
                return;
            }
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
                if (wert) setEingabe(startwerte());
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Ruler className="h-4 w-4" />
                    {bindungsdaten ? "Bindungsdaten" : "Bindungsdaten erfassen"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Bindungsdaten {titel}</DialogTitle>
                    <DialogDescription>
                        Alle Angaben sind optional. Sind alle Felder leer, werden die Bindungsdaten entfernt.
                    </DialogDescription>
                </DialogHeader>
                <BindungsdatenFelder
                    idPrefix={idPrefix}
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
