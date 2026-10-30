"use client";

import { useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Handware, HandwareDaten } from "@/types/handwaretypes";

type HandwareDialogProps = {
    trigger: ReactNode;
    // Bearbeiten: vorhandener Artikel, ohne Angabe wird ein neuer angelegt
    artikel?: Handware;
    // Vorhandene Kategorien als Vorschlag
    kategorien: string[];
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onSpeichern: (daten: HandwareDaten) => Promise<string | null>;
};

type Eingabe = { Name: string; Beschreibung: string; Kategorie: string; Anzahl: string; Preis: string };

function startwerte(artikel?: Handware): Eingabe {
    return {
        Name: artikel?.Name ?? "",
        Beschreibung: artikel?.Beschreibung ?? "",
        Kategorie: artikel?.Kategorie ?? "",
        Anzahl: artikel?.Anzahl != null ? String(artikel.Anzahl) : "",
        Preis: artikel ? String(artikel.Preis) : "",
    };
}

// Komma als Dezimaltrenner erlauben, z.B. "12,50"
const zahl = (text: string) => Number(text.trim().replace(",", "."));

// Handwarenartikel anlegen oder bearbeiten: nur Name und Preis sind Pflicht
export default function HandwareDialog({ trigger, artikel, kategorien, onSpeichern }: HandwareDialogProps) {
    const [offen, setOffen] = useState(false);
    const [werte, setWerte] = useState<Eingabe>(() => startwerte(artikel));
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const preisGueltig = werte.Preis.trim() !== "" && !Number.isNaN(zahl(werte.Preis)) && zahl(werte.Preis) >= 0;
    const anzahlGueltig = werte.Anzahl.trim() === "" || Number.isInteger(zahl(werte.Anzahl));
    const gueltig = werte.Name.trim() !== "" && preisGueltig && anzahlGueltig;

    function oeffnen(neu: boolean) {
        if (neu) {
            setWerte(startwerte(artikel));
            setFehler(null);
        }
        setOffen(neu);
    }

    function setze(feld: keyof Eingabe, wert: string) {
        setWerte((alt) => ({ ...alt, [feld]: wert }));
    }

    function speichern(e: React.FormEvent) {
        e.preventDefault();
        if (!gueltig) return;
        startTransition(async () => {
            const ergebnis = await onSpeichern({
                Name: werte.Name.trim(),
                Beschreibung: werte.Beschreibung.trim() || null,
                Kategorie: werte.Kategorie.trim() || null,
                Anzahl: werte.Anzahl.trim() === "" ? null : zahl(werte.Anzahl),
                Preis: zahl(werte.Preis),
            });
            if (ergebnis) {
                setFehler(ergebnis);
                return;
            }
            setOffen(false);
        });
    }

    return (
        <Dialog open={offen} onOpenChange={oeffnen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <form onSubmit={speichern} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{artikel ? `${artikel.Name} bearbeiten` : "Neuer Artikel"}</DialogTitle>
                        <DialogDescription>Nur Name und Preis sind Pflicht. Die Anzahl dient nur der Orientierung.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-1">
                        <Label htmlFor="hw-name">Name *</Label>
                        <Input id="hw-name" value={werte.Name} onChange={(e) => setze("Name", e.target.value)} maxLength={100} autoFocus />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="hw-preis">Preis (€) *</Label>
                            <Input
                                id="hw-preis"
                                inputMode="decimal"
                                placeholder="z. B. 12,50"
                                value={werte.Preis}
                                onChange={(e) => setze("Preis", e.target.value)}
                                aria-invalid={werte.Preis !== "" && !preisGueltig}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="hw-anzahl">Anzahl</Label>
                            <Input
                                id="hw-anzahl"
                                inputMode="numeric"
                                placeholder="optional"
                                value={werte.Anzahl}
                                onChange={(e) => setze("Anzahl", e.target.value)}
                                aria-invalid={!anzahlGueltig}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="hw-kategorie">Kategorie</Label>
                        <Input
                            id="hw-kategorie"
                            list="hw-kategorien"
                            placeholder="optional, z. B. Wachs"
                            value={werte.Kategorie}
                            onChange={(e) => setze("Kategorie", e.target.value)}
                            maxLength={50}
                        />
                        <datalist id="hw-kategorien">
                            {kategorien.map((k) => <option key={k} value={k} />)}
                        </datalist>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="hw-beschreibung">Beschreibung</Label>
                        <Textarea
                            id="hw-beschreibung"
                            placeholder="optional"
                            value={werte.Beschreibung}
                            onChange={(e) => setze("Beschreibung", e.target.value)}
                            maxLength={500}
                        />
                    </div>

                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={!gueltig || isPending}>
                            {isPending ? "Wird gespeichert..." : "Speichern"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
