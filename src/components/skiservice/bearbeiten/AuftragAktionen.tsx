"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { aendereAuftrag, loescheAuftrag } from "@/lib/bearbeitenactions";
import { Auftrag } from "@/types/skiservicetypes";
import SkiFormDialog from "./SkiFormDialog";
import FertigMailDialog from "./FertigMailDialog";
import { useAuftragAktualisieren } from "./useAuftragAktualisieren";

// "TT.MM.JJJJ" <-> "JJJJ-MM-TT" für das Datumsfeld
const zuIso = (datum?: string | null) => {
    const teile = datum?.split(".");
    return teile?.length === 3 ? `${teile[2]}-${teile[1]}-${teile[0]}` : "";
};
const zuDeutsch = (iso: string) => {
    const [jahr, monat, tag] = iso.split("-");
    return iso ? `${tag}.${monat}.${jahr}` : "";
};

type AuftragAktionenProps = {
    auftrag: Auftrag;
    // Weitere Aktionen vor "Löschen", z.B. Etiketten und Quittung
    children?: React.ReactNode;
};

// Hauptaktion im Kopf: alle offenen Ski fertig melden, mit Frage nach der Mail
export function AlleFertigButton({ auftrag }: { auftrag: Auftrag }) {
    const offeneSkis = auftrag.skis.filter((ski) => ski.status !== 1);
    if (offeneSkis.length === 0) return null;
    return (
        <FertigMailDialog
            auftrag={auftrag}
            skis={offeneSkis}
            trigger={
                <Button type="button">
                    <CheckCheck className="h-4 w-4" />
                    Alle fertig
                </Button>
            }
        />
    );
}

// Buttons für die Aktionsleiste der Detailansicht, "Löschen" ganz rechts
export default function AuftragAktionen({ auftrag, children }: AuftragAktionenProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const aktualisieren = useAuftragAktualisieren(auftrag.id);
    const bezahlt = auftrag.bezahlt === "ja" || auftrag.quittung_id != null;
    const [datumOffen, setDatumOffen] = useState(false);
    const [datum, setDatum] = useState(zuIso(auftrag.abhol_date));
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function datumSpeichern() {
        startTransition(async () => {
            const antwort = await aendereAuftrag(auftrag.id, { abhol_date: zuDeutsch(datum) });
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            aktualisieren(antwort.data);
            queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
            setDatumOffen(false);
        });
    }

    return (
        <>
            <SkiFormDialog auftragId={auftrag.id} bezahlt={bezahlt} kundeId={auftrag.kunden_id} />

            <Dialog open={datumOffen} onOpenChange={(wert) => { setDatumOffen(wert); setFehler(null); if (wert) setDatum(zuIso(auftrag.abhol_date)); }}>
                <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                        <CalendarDays className="h-4 w-4" />
                        Fertig bis ändern
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Fertig bis</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="fertig-bis">Datum (leer = kein Datum)</Label>
                        <Input id="fertig-bis" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
                        {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={datumSpeichern} disabled={isPending}>
                            {isPending ? "Speichern..." : "Speichern"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {children}

            <div className="sm:ml-auto">
                <LoeschenDialog
                    titel={`Auftrag ${auftrag.name ?? ""} löschen`}
                    beschreibung="Der Auftrag und alle zugehörigen Ski werden endgültig gelöscht."
                    buttonText="Löschen"
                    deaktiviert={bezahlt}
                    deaktiviertGrund="Bezahlte Aufträge können nicht gelöscht werden"
                    onLoeschen={async () => {
                        const antwort = await loescheAuftrag(auftrag.id);
                        if (!antwort.success) return antwort.error;
                        queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
                        router.push("/skiservice/anzeigen");
                        return null;
                    }}
                />
            </div>
        </>
    );
}
