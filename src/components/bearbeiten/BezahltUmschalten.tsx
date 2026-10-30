"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCheck, CircleX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type BezahltUmschaltenProps = {
    // Gespeicherter Status des Auftrags bzw. Verleihs (ohne Quittung mitzuzählen)
    bezahlt: boolean;
    hatQuittung: boolean;
    // "Auftrag" oder "Verleih", für die Texte im Dialog
    bezeichnung: string;
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onSetzen: (bezahlt: boolean, mitQuittung: boolean) => Promise<string | null>;
};

// Bezahlt-Status von Hand setzen. Ohne Quittung direkt, mit Quittung oder beim Zurücksetzen mit Rückfrage
export default function BezahltUmschalten({ bezahlt, hatQuittung, bezeichnung, onSetzen }: BezahltUmschaltenProps) {
    const queryClient = useQueryClient();
    const [offen, setOffen] = useState(false);
    const [mitQuittung, setMitQuittung] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const ziel = !bezahlt;

    function setzen(mitQuittungSetzen: boolean) {
        startTransition(async () => {
            const ergebnis = await onSetzen(ziel, mitQuittungSetzen);
            if (ergebnis) {
                setFehler(ergebnis);
                return;
            }
            setFehler(null);
            setOffen(false);
            if (mitQuittungSetzen) {
                // Andere Positionen auf derselben Quittung haben sich mit geändert
                queryClient.invalidateQueries({ queryKey: ["quittung"] });
                queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails"] });
                queryClient.invalidateQueries({ queryKey: ["saisonverleihDetails"] });
                queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
                queryClient.invalidateQueries({ queryKey: ["saisonverleihList"] });
            }
        });
    }

    function klick() {
        if (ziel && !hatQuittung) {
            setzen(false);
            return;
        }
        // Beim Setzen auf bezahlt ist "mit Quittung" vorausgewählt, beim Zurücksetzen nicht
        setMitQuittung(ziel);
        setFehler(null);
        setOffen(true);
    }

    return (
        <span className="inline-flex flex-col gap-1">
            <Button type="button" variant="outline" size="sm" onClick={klick} disabled={isPending}>
                {ziel ? <CircleCheck className="h-4 w-4" /> : <CircleX className="h-4 w-4" />}
                {ziel ? "Als bezahlt markieren" : "Als nicht bezahlt markieren"}
            </Button>
            {fehler && !offen && <span className="text-sm text-destructive">{fehler}</span>}

            <Dialog open={offen} onOpenChange={(wert) => { setOffen(wert); setFehler(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{ziel ? "Als bezahlt markieren" : "Als nicht bezahlt markieren"}</DialogTitle>
                        <DialogDescription>
                            {ziel
                                ? `Der ${bezeichnung} wird mit dem heutigen Datum als bezahlt markiert.`
                                : `Der ${bezeichnung} wird als nicht bezahlt markiert, das Bezahldatum wird entfernt.`}
                            {!ziel && hatQuittung && " Die Quittung bleibt erhalten."}
                        </DialogDescription>
                    </DialogHeader>
                    {hatQuittung && (
                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="bezahlt-mit-quittung"
                                checked={mitQuittung}
                                onCheckedChange={(wert) => setMitQuittung(wert === true)}
                                disabled={isPending}
                            />
                            <Label htmlFor="bezahlt-mit-quittung" className="font-normal leading-snug">
                                Quittung und alle Positionen darauf ebenfalls ändern
                            </Label>
                        </div>
                    )}
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>Abbrechen</Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant={ziel ? "default" : "destructive"}
                            onClick={() => setzen(hatQuittung && mitQuittung)}
                            disabled={isPending}
                        >
                            {isPending ? "Speichern..." : ziel ? "Als bezahlt markieren" : "Als nicht bezahlt markieren"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </span>
    );
}
