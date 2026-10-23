"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarYears, format, parseISO } from "date-fns";
import { Archive, ArchiveRestore, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bindungsdatenOptions } from "@/hooks/useBindungsdatenOptions";
import { setBindungsdatenArchiviert } from "@/lib/bindungsdatenactions";
import { bindungsdatenText, BindungsdatenEingabe, BindungsdatenListeEintrag, zuEingabe } from "@/types/bindungsdatentypes";

type LetzteBindungsdatenDialogProps = {
    kundeId: number | undefined;
    deaktiviert?: boolean;
    onUebernehmen: (eingabe: BindungsdatenEingabe, hinweis: string) => void;
};

export default function LetzteBindungsdatenDialog({ kundeId, deaktiviert = false, onUebernehmen }: LetzteBindungsdatenDialogProps) {
    const [offen, setOffen] = useState(false);
    const [mitArchiv, setMitArchiv] = useState(false);
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();

    const { data, error, isFetching } = useQuery({
        ...bindungsdatenOptions(kundeId ?? 0, mitArchiv),
        enabled: offen && kundeId !== undefined,
    });

    function uebernehmen(eintrag: BindungsdatenListeEintrag) {
        // Alter um die seit der Erfassung vergangenen Jahre erhöhen
        const jahre = differenceInCalendarYears(new Date(), parseISO(eintrag.Erfasst_Am));
        const alter = eintrag.Alter !== null ? Math.min(eintrag.Alter + jahre, 100) : null;
        const eingabe = { ...zuEingabe({ ...eintrag, Alter: alter }), vorlage_id: eintrag.ID };
        const datum = format(parseISO(eintrag.Erfasst_Am), "dd.MM.yyyy");
        const herkunft = eintrag.Auftrag_Name ?? (eintrag.Verleih_Name ? `Verleih ${eintrag.Verleih_Name}` : null);
        const hinweis = `Übernommen vom ${datum}${herkunft ? ` (${herkunft})` : ""}`
            + (jahre > 0 && eintrag.Alter !== null ? `, Alter um ${jahre} ${jahre === 1 ? "Jahr" : "Jahre"} erhöht` : "")
            + ". Bitte prüfen.";
        onUebernehmen(eingabe, hinweis);
        setOffen(false);
    }

    function archivieren(eintrag: BindungsdatenListeEintrag) {
        startTransition(async () => {
            const antwort = await setBindungsdatenArchiviert(eintrag.ID, !eintrag.Archiviert);
            if (antwort.success) {
                await queryClient.invalidateQueries({ queryKey: ["bindungsdaten", kundeId] });
            }
        });
    }

    return (
        <Dialog open={offen} onOpenChange={setOffen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={deaktiviert || kundeId === undefined}
                    title={kundeId === undefined ? "Bitte zuerst einen Kunden auswählen" : undefined}
                >
                    <History className="h-4 w-4" />
                    Letzte Daten abfragen
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Bindungsdaten des Kunden</DialogTitle>
                    <DialogDescription>
                        Übernommene Daten ersetzen den alten Eintrag, er wird beim Speichern archiviert.
                    </DialogDescription>
                </DialogHeader>

                <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={mitArchiv} onCheckedChange={(wert) => setMitArchiv(wert === true)} />
                    Archivierte anzeigen
                </label>

                {error && <p className="text-sm text-destructive">{error.message}</p>}
                {isFetching && !data && <p className="text-sm text-muted-foreground">Lade Bindungsdaten...</p>}
                {data && data.length === 0 && (
                    <p className="text-sm text-muted-foreground">Keine Bindungsdaten für diesen Kunden vorhanden.</p>
                )}

                <ul className="divide-y">
                    {data?.map((eintrag) => (
                        <li key={eintrag.ID} className={`flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between ${eintrag.Archiviert ? "opacity-60" : ""}`}>
                            <div className="space-y-0.5">
                                <p className="font-medium">{bindungsdatenText(eintrag) ?? "Keine Werte"}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(parseISO(eintrag.Erfasst_Am), "dd.MM.yyyy")}
                                    {eintrag.Auftrag_Name && ` · ${eintrag.Ski_Name ?? eintrag.Auftrag_Name}`}
                                    {eintrag.Service && ` · ${eintrag.Service}`}
                                    {eintrag.Verleih_Name && ` · Verleih ${eintrag.Verleih_Name}`}
                                    {eintrag.Archiviert && " · archiviert"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" size="sm" onClick={() => uebernehmen(eintrag)}>Übernehmen</Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => archivieren(eintrag)}
                                    title={eintrag.Archiviert ? "Wiederherstellen" : "Archivieren"}
                                >
                                    {eintrag.Archiviert ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                                    {eintrag.Archiviert ? "Wiederherstellen" : "Archivieren"}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
