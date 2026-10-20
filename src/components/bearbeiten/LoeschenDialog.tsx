"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

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

type LoeschenDialogProps = {
    titel: string;
    beschreibung: string;
    // Text auf dem Auslöser-Button, ohne Text nur Icon
    buttonText?: string;
    deaktiviert?: boolean;
    deaktiviertGrund?: string;
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onLoeschen: () => Promise<string | null>;
};

export default function LoeschenDialog({ titel, beschreibung, buttonText, deaktiviert = false, deaktiviertGrund, onLoeschen }: LoeschenDialogProps) {
    const [offen, setOffen] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function loeschen() {
        startTransition(async () => {
            const ergebnis = await onLoeschen();
            if (ergebnis) {
                setFehler(ergebnis);
            } else {
                setFehler(null);
                setOffen(false);
            }
        });
    }

    return (
        <Dialog open={offen} onOpenChange={(wert) => { setOffen(wert); setFehler(null); }}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant={buttonText ? "outline" : "ghost"}
                    size={buttonText ? "sm" : "icon"}
                    className="text-destructive hover:text-destructive"
                    disabled={deaktiviert}
                    title={deaktiviert ? deaktiviertGrund : titel}
                >
                    <Trash2 className="h-4 w-4" />
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{titel}</DialogTitle>
                    <DialogDescription>{beschreibung}</DialogDescription>
                </DialogHeader>
                {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>Abbrechen</Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" onClick={loeschen} disabled={isPending}>
                        {isPending ? "Lösche..." : "Löschen"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
