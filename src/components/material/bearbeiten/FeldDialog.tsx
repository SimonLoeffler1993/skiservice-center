"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Feld = {
    name: string;
    label: string;
    typ?: "text" | "zahl" | "auswahl" | "bool";
    optionen?: { wert: string; text: string }[];
    // Hinweis unter dem Feld
    hinweis?: string;
    // Leer erlaubt
    optional?: boolean;
    platzhalter?: string;
};

export type FeldWerte = Record<string, string | boolean>;

type FeldDialogProps = {
    titel: string;
    felder: Feld[];
    startwerte: FeldWerte;
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onSpeichern: (werte: FeldWerte) => Promise<string | null>;
};

/** Zahl aus Eingabe, Dezimalkomma erlaubt. Leer = null, ungültig = NaN */
export function zahlAus(wert: string | boolean | undefined): number | null {
    if (typeof wert !== "string" || wert.trim() === "") return null;
    const zahl = Number(wert.trim().replace(",", "."));
    return Number.isFinite(zahl) ? zahl : NaN;
}

// Einfacher Bearbeiten-Dialog für Material, Hersteller und Modelle
export default function FeldDialog({ titel, felder, startwerte, onSpeichern }: FeldDialogProps) {
    const [offen, setOffen] = useState(false);
    const [werte, setWerte] = useState<FeldWerte>(startwerte);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function speichern() {
        for (const feld of felder) {
            const wert = werte[feld.name];
            if (feld.typ === "bool" || feld.optional) continue;
            if (typeof wert !== "string" || wert.trim() === "") {
                setFehler(`${feld.label} darf nicht leer sein.`);
                return;
            }
            if (feld.typ === "zahl" && Number.isNaN(zahlAus(wert))) {
                setFehler(`${feld.label} muss eine Zahl sein.`);
                return;
            }
        }
        startTransition(async () => {
            const ergebnis = await onSpeichern(werte);
            if (ergebnis) {
                setFehler(ergebnis);
                return;
            }
            setOffen(false);
        });
    }

    return (
        <Dialog
            open={offen}
            onOpenChange={(wert) => {
                setOffen(wert);
                setFehler(null);
                if (wert) setWerte(startwerte);
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon" title="Bearbeiten">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{titel}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {felder.map((feld) => {
                        const id = `feld-${feld.name}`;
                        const wert = werte[feld.name];
                        if (feld.typ === "bool") {
                            return (
                                <label key={feld.name} className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={wert === true}
                                        onCheckedChange={(neu) => setWerte({ ...werte, [feld.name]: neu === true })}
                                    />
                                    {feld.label}
                                </label>
                            );
                        }
                        return (
                            <div key={feld.name} className="space-y-1">
                                <Label htmlFor={id}>{feld.label}{feld.optional && " (optional)"}</Label>
                                {feld.typ === "auswahl" ? (
                                    <Select value={String(wert ?? "")} onValueChange={(neu) => setWerte({ ...werte, [feld.name]: neu })}>
                                        <SelectTrigger id={id} className="w-full">
                                            <SelectValue placeholder="Bitte wählen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {feld.optionen?.map((option) => (
                                                <SelectItem key={option.wert} value={option.wert}>{option.text}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id={id}
                                        inputMode={feld.typ === "zahl" ? "decimal" : undefined}
                                        value={String(wert ?? "")}
                                        placeholder={feld.platzhalter}
                                        onChange={(e) => setWerte({ ...werte, [feld.name]: e.target.value })}
                                    />
                                )}
                                {feld.hinweis && <p className="text-xs text-muted-foreground">{feld.hinweis}</p>}
                            </div>
                        );
                    })}
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                </div>
                <DialogFooter>
                    <Button type="button" onClick={speichern} disabled={isPending}>
                        {isPending ? "Speichern..." : "Speichern"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
