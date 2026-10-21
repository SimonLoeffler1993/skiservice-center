"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Archive, ExternalLink, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getMaterialVerwendung, loescheMaterial, MaterialArt, setMaterialAusgemustert } from "@/lib/materialbearbeitenactions";
import { VerleihVerwendung } from "@/types/materialtypes";

type MaterialEntfernenDialogProps = {
    art: MaterialArt;
    id: number;
    // z.B. "Ski V101", "Schuh INV-0042", "Stock Leki Rider"
    bezeichnung: string;
    onGeaendert: (ergebnis: "geloescht" | "ausgemustert") => void;
};

const NAME: Record<MaterialArt, string> = { ski: "Der Ski", schuh: "Der Schuh", stock: "Der Stock" };

function zeitraum(verleih: VerleihVerwendung) {
    if (verleih.Art === "tag" && verleih.Start_Am && verleih.Ende_Am) {
        return `Tagesverleih ${format(parseISO(verleih.Start_Am), "dd.MM.")}–${format(parseISO(verleih.Ende_Am), "dd.MM.yyyy")}`;
    }
    return "Saisonverleih";
}

/**
 * Entfernen von Ski, Schuh oder Stock, für alle drei gleich:
 * - unbenutzt: ausmustern oder endgültig löschen
 * - in Verleihen: nur ausmustern, die Verleihe werden aufgelistet
 */
export default function MaterialEntfernenDialog({ art, id, bezeichnung, onGeaendert }: MaterialEntfernenDialogProps) {
    const [offen, setOffen] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const { data, isFetching } = useQuery({
        queryKey: ["materialVerwendung", art, id],
        queryFn: () => getMaterialVerwendung(art, id),
        enabled: offen,
        staleTime: 0,
    });
    const verleihe = data?.success ? data.data : null;
    const benutzt = !!verleihe && verleihe.length > 0;
    const unterwegs = verleihe?.filter((v) => !v.Zurueck).length ?? 0;

    function ausfuehren(aktion: "ausmustern" | "loeschen") {
        startTransition(async () => {
            const antwort = aktion === "ausmustern"
                ? await setMaterialAusgemustert(art, id, true)
                : await loescheMaterial(art, id);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setOffen(false);
            onGeaendert(aktion === "ausmustern" ? "ausgemustert" : "geloescht");
        });
    }

    return (
        <Dialog open={offen} onOpenChange={(wert) => { setOffen(wert); setFehler(null); }}>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Entfernen">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{bezeichnung} entfernen</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            {isFetching && !verleihe && <p>Prüfe, ob {bezeichnung} in Verleihen verwendet wird...</p>}
                            {data && !data.success && <p className="text-destructive">{data.error}</p>}
                            {verleihe && !benutzt && (
                                <>
                                    <p>{NAME[art]} steckt in keinem Verleih. Du kannst ihn ausmustern oder endgültig löschen.</p>
                                    <ul className="list-disc pl-5">
                                        <li><strong>Ausmustern:</strong> verschwindet aus der Auswahl, bleibt gespeichert und lässt sich wiederherstellen.</li>
                                        <li><strong>Endgültig löschen:</strong> wird unwiderruflich entfernt.</li>
                                    </ul>
                                </>
                            )}
                            {benutzt && (
                                <p>
                                    {NAME[art]} steckt in {verleihe.length} {verleihe.length === 1 ? "Verleih" : "Verleihen"} und kann deshalb nicht gelöscht werden.
                                    Er wird <strong>ausgemustert</strong>: Er verschwindet aus der Auswahl, die Verleihe bleiben unverändert.
                                </p>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {benutzt && (
                    <div className="space-y-2">
                        {unterwegs > 0 && (
                            <p className="rounded-md bg-amber-50 p-2 text-sm text-amber-800">
                                Achtung: {unterwegs === 1 ? "Ein Verleih ist" : `${unterwegs} Verleihe sind`} noch unterwegs.
                            </p>
                        )}
                        <ul className="divide-y rounded-md border text-sm">
                            {verleihe.map((verleih) => (
                                <li key={verleih.ID} className="flex flex-wrap items-center justify-between gap-2 p-2">
                                    <div>
                                        <a
                                            href={`/saisonverleih/anzeigen/${verleih.ID}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
                                        >
                                            {verleih.Name}
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                        <p className="text-xs text-muted-foreground">
                                            {verleih.Kunde}{verleih.Fahrer ? ` · ${verleih.Fahrer}` : ""} · {zeitraum(verleih)}
                                        </p>
                                    </div>
                                    <span className={`rounded-md px-2 py-0.5 text-xs ${verleih.Zurueck ? "bg-muted" : "bg-amber-100 text-amber-800"}`}>
                                        {verleih.Zurueck ? "zurück" : "unterwegs"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {fehler && <p className="text-sm text-destructive">{fehler}</p>}

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>Abbrechen</Button>
                    </DialogClose>
                    {verleihe && (
                        <Button type="button" onClick={() => ausfuehren("ausmustern")} disabled={isPending}>
                            <Archive className="h-4 w-4" />
                            Ausmustern
                        </Button>
                    )}
                    {verleihe && !benutzt && (
                        <Button type="button" variant="destructive" onClick={() => ausfuehren("loeschen")} disabled={isPending}>
                            <Trash2 className="h-4 w-4" />
                            Endgültig löschen
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
