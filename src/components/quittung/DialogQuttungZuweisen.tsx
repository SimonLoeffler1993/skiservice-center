'use client';

import Quittungsliste from "@/components/lex/Quittungsliste";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { QuittungZiel, setExQuittungBeleg } from "@/lib/quittungactions";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useTransition } from "react";


type DialogQuittungZuweisenProps = {
    // Saisonverleih oder Skiservice-Auftrag
    ziel: QuittungZiel;
}

export default function DialogQuittungZuweisen({ ziel }: DialogQuittungZuweisenProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const [isPending, startTransition] = useTransition();
    const [fehler, setFehler] = useState<string | null>(null)

    const queryClient = useQueryClient();


    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedVoucherNumber = formData.get("selectedBeleg") as string;
        
        if (!selectedVoucherNumber) {
            setFehler("Bitte einen Beleg auswählen.")
            return
        }

        startTransition(async () => {
            const result = await setExQuittungBeleg(selectedVoucherNumber, ziel)
            if (!result.success) {
                setFehler(result.error ?? "Die Quittung konnte nicht zugewiesen werden.")
                return
            }
            setFehler(null)
            setOpen(false)
            // Detailansicht und Liste neu laden
            if (ziel.art === "verleih") {
                queryClient.invalidateQueries(saisonverleihDetailsOptions(ziel.id));
                queryClient.invalidateQueries({ queryKey: ["saisonverleihList"] });
            } else {
                queryClient.invalidateQueries(auftragDetailsOptions(ziel.id));
                queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(wert) => { setOpen(wert); setFehler(null); }}>
            <DialogTrigger asChild>
                <Button variant="outline">Quittung zuweisen</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[80vh]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-h-0 flex-1">
                    <DialogHeader>
                        <DialogTitle>Quittung zuweisen</DialogTitle>
                        <DialogDescription>Wähle einen Beleg aus der Liste aus.</DialogDescription>
                    </DialogHeader>

                    <div ref={scrollContainerRef} className="overflow-y-auto flex-1 min-h-0 px-1 pb-2">
                        <Quittungsliste scrollContainerRef={scrollContainerRef} />
                    </div>

                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
                            Abbrechen
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Zuweisen..." : "Zuweisen"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}