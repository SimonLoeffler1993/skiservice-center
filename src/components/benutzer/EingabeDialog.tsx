"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type EingabeDialogProps = {
    offen: boolean;
    onOffenChange: (offen: boolean) => void;
    titel: string;
    beschreibung?: string;
    aktionText: string;
    // Formularfelder; werden beim Absenden als FormData übergeben
    children: React.ReactNode;
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onAbsenden: (daten: FormData) => Promise<string | null>;
};

/** Kleiner Dialog mit Formular, z.B. Passwort zurücksetzen oder OIDC-Anmeldung übernehmen. */
export default function EingabeDialog({ offen, onOffenChange, titel, beschreibung, aktionText, children, onAbsenden }: EingabeDialogProps) {
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function absenden(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const daten = new FormData(e.currentTarget);
        startTransition(async () => {
            const ergebnis = await onAbsenden(daten);
            if (ergebnis) setFehler(ergebnis);
            else onOffenChange(false);
        });
    }

    return (
        <Dialog open={offen} onOpenChange={(auf) => { setFehler(null); onOffenChange(auf); }}>
            <DialogContent>
                <form onSubmit={absenden} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{titel}</DialogTitle>
                        {beschreibung && <DialogDescription>{beschreibung}</DialogDescription>}
                    </DialogHeader>
                    {children}
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>{isPending ? "Bitte warten…" : aktionText}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
