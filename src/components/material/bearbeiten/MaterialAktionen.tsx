"use client";

import { useState, useTransition } from "react";
import { ArchiveRestore } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MaterialArt, setMaterialAusgemustert } from "@/lib/materialbearbeitenactions";
import MaterialEntfernenDialog from "./MaterialEntfernenDialog";

type MaterialAktionenProps = {
    art: MaterialArt;
    id: number;
    bezeichnung: string;
    ausgemustert: boolean;
    // Bearbeiten-Dialog der jeweiligen Materialart
    bearbeiten: React.ReactNode;
    // Liste neu laden
    onGeaendert: () => void;
};

// Aktionen für Ski, Schuh und Stock: bearbeiten, entfernen bzw. wiederherstellen
export default function MaterialAktionen({ art, id, bezeichnung, ausgemustert, bearbeiten, onGeaendert }: MaterialAktionenProps) {
    const [meldung, setMeldung] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function wiederherstellen() {
        startTransition(async () => {
            const antwort = await setMaterialAusgemustert(art, id, false);
            setMeldung(antwort.success ? null : antwort.error);
            if (antwort.success) onGeaendert();
        });
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
                {ausgemustert ? (
                    <Button type="button" variant="outline" size="sm" onClick={wiederherstellen} disabled={isPending}>
                        <ArchiveRestore className="h-4 w-4" />
                        Wiederherstellen
                    </Button>
                ) : (
                    <>
                        {bearbeiten}
                        <MaterialEntfernenDialog
                            art={art}
                            id={id}
                            bezeichnung={bezeichnung}
                            onGeaendert={() => onGeaendert()}
                        />
                    </>
                )}
            </div>
            {meldung && <p className="text-xs text-destructive">{meldung}</p>}
        </div>
    );
}

// Badge für ausgemustertes Material
export function AusgemustertBadge() {
    return <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">Ausgemustert</span>;
}

// Schalter über den Listen
export function AusgemusterteFilter({ wert, onChange, anzahl }: { wert: boolean; onChange: (wert: boolean) => void; anzahl: number }) {
    return (
        <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={wert} onCheckedChange={(neu) => onChange(neu === true)} />
            Ausgemusterte anzeigen ({anzahl})
        </label>
    );
}
