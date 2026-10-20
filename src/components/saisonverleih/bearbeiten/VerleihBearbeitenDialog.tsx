"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { aendereVerleih, VerleihAenderung } from "@/lib/bearbeitenactions";
import { SaisonverleihRead, VerleihArt } from "@/types/saisonverleihtypes";
import { useVerleihAktualisieren } from "./useVerleihAktualisieren";

type VerleihBearbeitenDialogProps = {
    verleih: SaisonverleihRead;
    bezahlt: boolean;
};

export default function VerleihBearbeitenDialog({ verleih, bezahlt }: VerleihBearbeitenDialogProps) {
    const [offen, setOffen] = useState(false);
    const [bemerkung, setBemerkung] = useState(verleih.Bemerkung ?? "");
    const [art, setArt] = useState<VerleihArt>(verleih.Art);
    const [startAm, setStartAm] = useState(verleih.Start_Am ?? "");
    const [endeAm, setEndeAm] = useState(verleih.Ende_Am ?? "");
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useVerleihAktualisieren(verleih.ID);

    function oeffnen(wert: boolean) {
        setOffen(wert);
        setFehler(null);
        if (wert) {
            setBemerkung(verleih.Bemerkung ?? "");
            setArt(verleih.Art);
            setStartAm(verleih.Start_Am ?? "");
            setEndeAm(verleih.Ende_Am ?? "");
        }
    }

    function speichern() {
        // Bei bezahlten Verleihen nur die Bemerkung senden
        const daten: VerleihAenderung = bezahlt
            ? { Bemerkung: bemerkung }
            : {
                Bemerkung: bemerkung,
                Art: art,
                ...(startAm ? { Start_Am: startAm } : {}),
                Ende_Am: art === "tag" ? endeAm || null : null,
            };
        startTransition(async () => {
            const antwort = await aendereVerleih(verleih.ID, daten);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            aktualisieren(antwort.data);
            setOffen(false);
        });
    }

    return (
        <Dialog open={offen} onOpenChange={oeffnen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                    Bearbeiten
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{verleih.Name} bearbeiten</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {bezahlt && (
                        <p className="text-sm text-muted-foreground">Der Verleih ist bezahlt, nur die Bemerkung kann geändert werden.</p>
                    )}
                    <div className="space-y-2">
                        <Label>Art</Label>
                        <RadioGroup value={art} onValueChange={(wert) => setArt(wert as VerleihArt)} className="flex gap-6" disabled={bezahlt}>
                            <label className="flex items-center gap-2"><RadioGroupItem value="saison" />Saisonverleih</label>
                            <label className="flex items-center gap-2"><RadioGroupItem value="tag" />Tagesverleih</label>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">Die Verleihnummer bleibt beim Wechsel erhalten.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="verleih-start">{art === "tag" ? "Von" : "Start am"}</Label>
                            <Input id="verleih-start" type="date" value={startAm} onChange={(e) => setStartAm(e.target.value)} disabled={bezahlt} />
                        </div>
                        {art === "tag" && (
                            <div className="space-y-2">
                                <Label htmlFor="verleih-ende">Bis</Label>
                                <Input id="verleih-ende" type="date" value={endeAm} min={startAm || undefined} onChange={(e) => setEndeAm(e.target.value)} disabled={bezahlt} />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="verleih-bemerkung">Bemerkung</Label>
                        <Textarea id="verleih-bemerkung" rows={3} value={bemerkung} onChange={(e) => setBemerkung(e.target.value)} />
                    </div>
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
