"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MaterialEingabe from "@/components/saisonverleih/material/MaterialEingabe";
import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { fuegeMaterialHinzu } from "@/lib/bearbeitenactions";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import { useVerleihAktualisieren } from "./useVerleihAktualisieren";

type MaterialHinzufuegenDialogProps = {
    verleih: SaisonverleihRead;
    bezahlt: boolean;
};

export default function MaterialHinzufuegenDialog({ verleih, bezahlt }: MaterialHinzufuegenDialogProps) {
    const [offen, setOffen] = useState(false);
    const aktualisieren = useVerleihAktualisieren(verleih.ID);

    return (
        <Dialog open={offen} onOpenChange={setOffen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={bezahlt} title={bezahlt ? "Verleih ist bezahlt" : undefined}>
                    <Plus className="h-4 w-4" />
                    Material hinzufügen
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Material zu {verleih.Name} hinzufügen</DialogTitle>
                </DialogHeader>
                {/* Eigener Context, damit die Eingabe die passende Preisauswahl (Saison/Tag) bekommt */}
                <SaisonverleihContextProvider
                    startArt={verleih.Art}
                    startZeitraum={verleih.Start_Am && verleih.Ende_Am ? { from: parseISO(verleih.Start_Am), to: parseISO(verleih.Ende_Am) } : undefined}
                    verleihId={verleih.ID}
                >
                    <MaterialEingabe
                        kundeId={verleih.Kunde_ID}
                        onSpeichern={async (material) => {
                            const antwort = await fuegeMaterialHinzu(verleih.ID, material);
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
