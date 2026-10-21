"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getStammdatenVerwendung, loescheStammdaten, StammdatenArt } from "@/lib/materialbearbeitenactions";

type StammdatenLoeschenDialogProps = {
    art: StammdatenArt;
    id: number;
    // z.B. "Hersteller Atomic"
    bezeichnung: string;
    // Was auf den Eintrag verweist, Einzahl und Mehrzahl, z.B. ["Modell", "Modellen"]
    verweis: [string, string];
    onGeloescht: () => void;
};

// Löschen von Herstellern und Modellen, nur wenn nichts mehr darauf verweist
export default function StammdatenLoeschenDialog({ art, id, bezeichnung, verweis, onGeloescht }: StammdatenLoeschenDialogProps) {
    const [offen, setOffen] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const { data, isFetching } = useQuery({
        queryKey: ["stammdatenVerwendung", art, id],
        queryFn: () => getStammdatenVerwendung(art, id),
        enabled: offen,
        staleTime: 0,
    });
    const verwendung = data?.success ? data.data : null;
    const benutzt = !!verwendung && verwendung.Anzahl > 0;

    function loeschen() {
        startTransition(async () => {
            const antwort = await loescheStammdaten(art, id);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setOffen(false);
            onGeloescht();
        });
    }

    return (
        <Dialog open={offen} onOpenChange={(wert) => { setOffen(wert); setFehler(null); }}>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Löschen">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{bezeichnung} löschen</DialogTitle>
                    <DialogDescription>
                        {isFetching && !verwendung && "Prüfe Verwendung..."}
                        {verwendung && !benutzt && "Wird nirgends mehr verwendet und kann endgültig gelöscht werden."}
                        {benutzt && (
                            <>
                                Wird noch von {verwendung.Anzahl} {verwendung.Anzahl === 1 ? verweis[0] : verweis[1]} verwendet
                                ({verwendung.Beispiele.join(", ")}{verwendung.Anzahl > verwendung.Beispiele.length ? ", …" : ""})
                                und kann deshalb nicht gelöscht werden.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {data && !data.success && <p className="text-sm text-destructive">{data.error}</p>}
                {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>Abbrechen</Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" onClick={loeschen} disabled={isPending || !verwendung || benutzt}>
                        {isPending ? "Lösche..." : "Löschen"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
