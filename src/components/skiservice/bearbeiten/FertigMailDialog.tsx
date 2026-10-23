"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { auftragFertigStellen } from "@/lib/auftragaction";
import { Auftrag, Ski } from "@/types/skiservicetypes";

type FertigMailDialogProps = {
    auftrag: Auftrag;
    // Ski, die fertig gesetzt werden. Danach ist der ganze Auftrag fertig
    skis: Ski[];
    // Ohne Angabe steuert der Dialog sich selbst über den Trigger
    offen?: boolean;
    onOpenChange?: (offen: boolean) => void;
    trigger?: React.ReactNode;
};

/**
 * Stellt die letzten offenen Ski eines Auftrags fertig und fragt,
 * ob der Kunde die Fertig-Mail bekommen soll.
 */
export default function FertigMailDialog({ auftrag, skis, offen, onOpenChange, trigger }: FertigMailDialogProps) {
    const [eigenOffen, setEigenOffen] = useState(false);
    const istOffen = offen ?? eigenOffen;
    const queryClient = useQueryClient();

    const email = auftrag.kunde?.Email?.trim();
    const bereitsBenachrichtigt = auftrag.benachrichtigt?.toLowerCase() === "ja";
    const mailMoeglich = !!email && !bereitsBenachrichtigt;
    const [mail, setMail] = useState(mailMoeglich);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function setOffen(wert: boolean) {
        if (wert) {
            setMail(mailMoeglich);
            setFehler(null);
        }
        setEigenOffen(wert);
        onOpenChange?.(wert);
    }

    function fertigstellen() {
        startTransition(async () => {
            const antwort = await auftragFertigStellen(auftrag.id, skis.map((ski) => ski.id), mail && mailMoeglich);
            if (!antwort.success) {
                setFehler(antwort.error ?? "Fehler beim Fertigstellen");
                return;
            }
            await queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", auftrag.id] });
            queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
            setOffen(false);
        });
    }

    return (
        <Dialog open={istOffen} onOpenChange={setOffen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {skis.length === 1 ? `Ski ${skis[0].name ?? ""} fertigstellen` : `${skis.length} offene Ski fertigstellen`}
                    </DialogTitle>
                    <DialogDescription>
                        {skis.length === 1
                            ? "Das ist der letzte offene Ski, danach ist der Auftrag fertig."
                            : "Alle offenen Ski werden als fertig markiert, danach ist der Auftrag fertig."}
                    </DialogDescription>
                </DialogHeader>

                {skis.length > 1 && (
                    <ul className="list-disc pl-5 text-sm">
                        {skis.map((ski) => (
                            <li key={ski.id}>{ski.name} · {ski.service}</li>
                        ))}
                    </ul>
                )}

                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            id="fertig-mail"
                            checked={mail && mailMoeglich}
                            onCheckedChange={(wert) => setMail(wert === true)}
                            disabled={!mailMoeglich}
                        />
                        Kunde per Mail benachrichtigen
                    </label>
                    <p className="pl-6 text-xs text-muted-foreground">
                        {bereitsBenachrichtigt
                            ? "Kunde wurde bereits benachrichtigt."
                            : email
                                ? `Fertig-Mail an ${email}`
                                : "Für den Kunden ist keine E-Mail-Adresse hinterlegt."}
                    </p>
                </div>

                {fehler && <p className="text-sm text-destructive">{fehler}</p>}

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setOffen(false)} disabled={isPending}>
                        Abbrechen
                    </Button>
                    <Button type="button" onClick={fertigstellen} disabled={isPending}>
                        {isPending ? "Fertigstellen..." : "Fertigstellen"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
