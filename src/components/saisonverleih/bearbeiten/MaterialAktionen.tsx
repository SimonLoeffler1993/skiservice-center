"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { aendereMaterial, entferneMaterial } from "@/lib/bearbeitenactions";
import { MaterialRead } from "@/types/materialtypes";
import { useVerleihAktualisieren } from "./useVerleihAktualisieren";

type MaterialAktionenProps = {
    verleihId: number;
    material: MaterialRead;
    bezahlt: boolean;
    letztesMaterial: boolean;
};

export default function MaterialAktionen({ verleihId, material, bezahlt, letztesMaterial }: MaterialAktionenProps) {
    const [offen, setOffen] = useState(false);
    const [preis, setPreis] = useState(String(material.Preis));
    const [fahrer, setFahrer] = useState(material.SkiFahrerName ?? "");
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useVerleihAktualisieren(verleihId);

    function speichern() {
        const neuerPreis = Number(preis);
        if (!bezahlt && (Number.isNaN(neuerPreis) || neuerPreis <= 0)) {
            setFehler("Bitte einen gültigen Preis eingeben.");
            return;
        }
        startTransition(async () => {
            // Nach dem Bezahlen nur noch den Fahrernamen ändern
            const daten = bezahlt ? { SkiFahrerName: fahrer } : { Preis: neuerPreis, SkiFahrerName: fahrer };
            const antwort = await aendereMaterial(verleihId, material.ID, daten);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            aktualisieren(antwort.data);
            setOffen(false);
        });
    }

    return (
        <div className="flex justify-end gap-1 px-4 pb-2">
            <Dialog
                open={offen}
                onOpenChange={(wert) => {
                    setOffen(wert);
                    setFehler(null);
                    if (wert) {
                        setPreis(String(material.Preis));
                        setFahrer(material.SkiFahrerName ?? "");
                    }
                }}
            >
                <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" title="Bearbeiten">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Material bearbeiten</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`material-preis-${material.ID}`}>Preis (€)</Label>
                            <Input
                                id={`material-preis-${material.ID}`}
                                type="number"
                                step="0.01"
                                min={0}
                                value={preis}
                                onChange={(e) => setPreis(e.target.value)}
                                disabled={bezahlt}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`material-fahrer-${material.ID}`}>Skifahrer Name</Label>
                            <Input id={`material-fahrer-${material.ID}`} value={fahrer} onChange={(e) => setFahrer(e.target.value)} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Um Ski, Schuh oder Stock zu tauschen, das Material entfernen und neu hinzufügen.
                        </p>
                        {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={speichern} disabled={isPending}>
                            {isPending ? "Speichern..." : "Speichern"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <LoeschenDialog
                titel="Material entfernen"
                beschreibung="Das Material wird aus dem Verleih entfernt."
                deaktiviert={bezahlt || letztesMaterial}
                deaktiviertGrund={bezahlt ? "Verleih ist bezahlt" : "Letztes Material, bitte den Verleih löschen"}
                onLoeschen={async () => {
                    const antwort = await entferneMaterial(verleihId, material.ID);
                    if (!antwort.success) return antwort.error;
                    aktualisieren(antwort.data);
                    return null;
                }}
            />
        </div>
    );
}
