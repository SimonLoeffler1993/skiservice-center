"use client";

import { useEffect, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mailvorlagenOptions } from "@/hooks/useMailvorlagenOptions";
import { setzeMailvorlageZurueck, speichereMailvorlage } from "@/lib/mailvorlagenactions";
import { MailVorlage } from "@/types/mailvorlagentypes";
import TestMail from "./TestMail";
import TextEditor from "./TextEditor";
import Vorschau from "./Vorschau";

type VorlageBearbeitenProps = {
    vorlage: MailVorlage;
    // Meldet nach oben, ob es ungespeicherte Änderungen gibt (Rückfrage beim Wechsel der Vorlage)
    onUngespeichert: (ungespeichert: boolean) => void;
}

type Stand = { betreff: string; inhalt: string };

export default function VorlageBearbeiten({ vorlage, onUngespeichert }: VorlageBearbeitenProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    // Womit die Editoren gefüllt sind; eine neue Nummer baut sie neu auf (Verwerfen, Zurücksetzen)
    const [start, setStart] = useState({ betreff: vorlage.betreff, inhalt: vorlage.inhalt, nummer: 0 });
    // Gespeicherter Stand, so wie ihn die Editoren ausgeben: Vergleichsbasis für "geändert"
    const [basis, setBasis] = useState<Stand>({ betreff: vorlage.betreff, inhalt: vorlage.inhalt });
    const [aktuell, setAktuell] = useState<Stand>({ betreff: vorlage.betreff, inhalt: vorlage.inhalt });
    const [meldung, setMeldung] = useState<{ ok: boolean; text: string } | null>(null);
    const [zuruecksetzenOffen, setZuruecksetzenOffen] = useState(false);

    const ungespeichert = aktuell.betreff !== basis.betreff || aktuell.inhalt !== basis.inhalt;

    useEffect(() => {
        onUngespeichert(ungespeichert);
    }, [ungespeichert, onUngespeichert]);

    function uebernehmen(neu: MailVorlage) {
        queryClient.setQueryData(mailvorlagenOptions.queryKey, (alt) => alt?.map((v) => (v.schluessel === neu.schluessel ? neu : v)));
    }

    function neuAufbauen(betreff: string, inhalt: string) {
        setBasis({ betreff, inhalt });
        setAktuell({ betreff, inhalt });
        setStart((alt) => ({ betreff, inhalt, nummer: alt.nummer + 1 }));
    }

    function speichern() {
        setMeldung(null);
        const gesendet = aktuell;
        startTransition(async () => {
            const antwort = await speichereMailvorlage(vorlage.schluessel, gesendet);
            if (!antwort.success) {
                setMeldung({ ok: false, text: antwort.error });
                return;
            }
            uebernehmen(antwort.data);
            setBasis(gesendet);
            setMeldung({ ok: true, text: "Gespeichert. Neue Mails gehen ab sofort mit diesem Text raus." });
        });
    }

    function verwerfen() {
        setMeldung(null);
        neuAufbauen(vorlage.betreff, vorlage.inhalt);
    }

    function zuruecksetzen() {
        setMeldung(null);
        startTransition(async () => {
            const antwort = await setzeMailvorlageZurueck(vorlage.schluessel);
            setZuruecksetzenOffen(false);
            if (!antwort.success) {
                setMeldung({ ok: false, text: antwort.error });
                return;
            }
            uebernehmen(antwort.data);
            neuAufbauen(antwort.data.betreff, antwort.data.inhalt);
            setMeldung({ ok: true, text: "Die Vorlage hat wieder den Originaltext." });
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{vorlage.bezeichnung}</CardTitle>
                <CardDescription>
                    {vorlage.beschreibung}
                    {vorlage.geaendert && vorlage.geaendert_am && ` Zuletzt geändert am ${new Date(vorlage.geaendert_am).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}.`}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium">Betreff</p>
                        <TextEditor
                            key={`betreff-${start.nummer}`}
                            einzeilig
                            beschriftung="Betreff"
                            wert={start.betreff}
                            platzhalter={vorlage.platzhalter}
                            onBereit={(betreff) => { setBasis((alt) => ({ ...alt, betreff })); setAktuell((alt) => ({ ...alt, betreff })); }}
                            onChange={(betreff) => setAktuell((alt) => ({ ...alt, betreff }))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium">Text der Mail</p>
                        <TextEditor
                            key={`inhalt-${start.nummer}`}
                            beschriftung="Text der Mail"
                            wert={start.inhalt}
                            platzhalter={vorlage.platzhalter}
                            bausteine={vorlage.bausteine}
                            onBereit={(inhalt) => { setBasis((alt) => ({ ...alt, inhalt })); setAktuell((alt) => ({ ...alt, inhalt })); }}
                            onChange={(inhalt) => setAktuell((alt) => ({ ...alt, inhalt }))}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" disabled={isPending || !ungespeichert} onClick={speichern}>
                            {isPending ? "Speichere..." : "Speichern"}
                        </Button>
                        <Button type="button" variant="outline" disabled={isPending || !ungespeichert} onClick={verwerfen}>
                            Änderungen verwerfen
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="ml-auto"
                            disabled={isPending || (!vorlage.geaendert && !ungespeichert)}
                            onClick={() => setZuruecksetzenOffen(true)}
                        >
                            <RotateCcw />
                            Auf Original zurücksetzen
                        </Button>
                    </div>
                    {ungespeichert && !meldung && <p className="text-sm text-amber-700">Es gibt ungespeicherte Änderungen.</p>}
                    {meldung && <p className={meldung.ok ? "text-sm text-green-700" : "text-sm text-destructive"}>{meldung.text}</p>}
                    {!vorlage.geaendert && !ungespeichert && !meldung && (
                        <p className="text-sm text-muted-foreground">Diese Vorlage hat den Originaltext.</p>
                    )}

                    <TestMail schluessel={vorlage.schluessel} hatAenderungen={ungespeichert} />
                </div>

                <div className="space-y-1.5">
                    <p className="text-sm font-medium">So sieht die Mail aus (mit Beispieldaten)</p>
                    <Vorschau schluessel={vorlage.schluessel} betreff={aktuell.betreff} inhalt={aktuell.inhalt} />
                </div>
            </CardContent>

            <Dialog open={zuruecksetzenOffen} onOpenChange={setZuruecksetzenOffen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Auf Original zurücksetzen?</DialogTitle>
                        <DialogDescription>
                            Betreff und Text von „{vorlage.bezeichnung}“ werden durch den Originaltext ersetzt, so wie unten zu sehen.
                            Der jetzige Text geht dabei verloren.
                        </DialogDescription>
                    </DialogHeader>
                    {zuruecksetzenOffen && <Vorschau schluessel={vorlage.schluessel} betreff={vorlage.original_betreff} inhalt={vorlage.original_inhalt} />}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setZuruecksetzenOffen(false)}>Abbrechen</Button>
                        <Button type="button" variant="destructive" disabled={isPending} onClick={zuruecksetzen}>
                            {isPending ? "Setze zurück..." : "Zurücksetzen"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
