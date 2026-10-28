"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MaterialEingabe from "@/components/saisonverleih/material/MaterialEingabe";
import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { aendereMaterial, MaterialDaten } from "@/lib/bearbeitenactions";
import { MaterialRead } from "@/types/materialtypes";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import { useVerleihAktualisieren } from "./useVerleihAktualisieren";

type MaterialBearbeitenDialogProps = {
    verleih: SaisonverleihRead;
    material: MaterialRead;
    // Fahrer bzw. "Ausrüstung #n" für den Titel
    bezeichnung: string;
    bezahlt: boolean;
};

// Material ändern wie bei der Eingabe: Preis, Fahrer, Ski, Schuh, Stock und Bindungsdaten.
// Nach dem Bezahlen kann das Material noch getauscht werden, nur der Preis ist gesperrt.
export default function MaterialBearbeitenDialog({ verleih, material, bezeichnung, bezahlt }: MaterialBearbeitenDialogProps) {
    const [offen, setOffen] = useState(false);
    const aktualisieren = useVerleihAktualisieren(verleih.ID);

    return (
        <Dialog open={offen} onOpenChange={setOffen}>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon" title="Bearbeiten">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{bezeichnung} bearbeiten</DialogTitle>
                </DialogHeader>
                {/* Eigener Context für Preisauswahl und Belegungsprüfung (ohne den eigenen Verleih) */}
                <SaisonverleihContextProvider
                    startArt={verleih.Art}
                    startZeitraum={verleih.Start_Am && verleih.Ende_Am ? { from: parseISO(verleih.Start_Am), to: parseISO(verleih.Ende_Am) } : undefined}
                    verleihId={verleih.ID}
                >
                    <MaterialEingabe
                        vorgabe={material}
                        preisGesperrt={bezahlt}
                        kundeId={verleih.Kunde_ID}
                        onSpeichern={async (eingabe) => {
                            const { Preis, Preis_ID, schuhAnzeige, ...werte } = eingabe;
                            void schuhAnzeige;
                            const daten: MaterialDaten = {
                                ...werte,
                                // Leere Schuh-Nr. entfernt den Schuh
                                schuhnr: werte.schuhnr ?? null,
                                ...(bezahlt ? {} : { Preis, Preis_ID }),
                            };
                            const antwort = await aendereMaterial(verleih.ID, material.ID, daten);
                            if (!antwort.success) return antwort.error;
                            aktualisieren(antwort.data);
                            setOffen(false);
                            return null;
                        }}
                    />
                </SaisonverleihContextProvider>
            </DialogContent>
        </Dialog>
    );
}
