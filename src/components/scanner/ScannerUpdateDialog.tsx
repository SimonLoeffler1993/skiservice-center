"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type ScannerUpdateDialogProps = {
    name: string;
    deaktiviert: boolean;
    deaktiviertGrund?: string;
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onStarten: () => Promise<string | null>;
};

// Bestätigung vor dem Anstoßen: während des Updates nimmt der Scanner keine Scans an
export default function ScannerUpdateDialog({ name, deaktiviert, deaktiviertGrund, onStarten }: ScannerUpdateDialogProps) {
    const [offen, setOffen] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function starten() {
        startTransition(async () => {
            const ergebnis = await onStarten();
            setFehler(ergebnis);
            if (!ergebnis) setOffen(false);
        });
    }

    return (
        <Dialog open={offen} onOpenChange={(wert) => { setOffen(wert); setFehler(null); }}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={deaktiviert} title={deaktiviert ? deaktiviertGrund : undefined}>
                    <Download className="h-4 w-4" />
                    Firmware aktualisieren
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Firmware von {name} aktualisieren</DialogTitle>
                    <DialogDescription>
                        Der Scanner prüft bei seiner nächsten Meldung (spätestens nach 30 Sekunden) selbst, ob es eine neue Firmware gibt,
                        lädt sie herunter und startet neu. Das dauert wenige Minuten: so lange blinkt er weiß und nimmt keine Scans an.
                        Bitte nicht ausstecken.
                    </DialogDescription>
                </DialogHeader>
                {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>Abbrechen</Button>
                    </DialogClose>
                    <Button type="button" onClick={starten} disabled={isPending}>
                        {isPending ? "Starte..." : "Update starten"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
