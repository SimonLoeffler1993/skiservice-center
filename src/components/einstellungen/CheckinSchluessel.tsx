"use client";

import { useRef, useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Check, Copy, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { checkinSchluesselOptions, checkinStatusOptions } from "@/hooks/useCheckinOptions";
import { erzeugeCheckinSchluessel } from "@/lib/checkinactions";
import { cn } from "@/lib/utils";
import { CheckinSchluessel as Schluessel } from "@/types/checkintypes";

function datum(wert: string) {
    return format(parseISO(wert), "dd.MM.yyyy HH:mm");
}

// Ein Public Key mit Kopieren-Knopf. Über HTTP gibt es die Zwischenablage-API nicht, dann über das Textfeld.
function SchluesselZeile({ eintrag, neuester }: { eintrag: Schluessel; neuester: boolean }) {
    const feld = useRef<HTMLTextAreaElement>(null);
    const [kopiert, setKopiert] = useState(false);

    async function kopieren() {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(eintrag.public_key);
            } else {
                feld.current?.select();
                document.execCommand("copy");
            }
            setKopiert(true);
            setTimeout(() => setKopiert(false), 2000);
        } catch {
            feld.current?.select();
        }
    }

    return (
        <div className="space-y-2 rounded-md border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 text-sm">
                    <span className="font-medium">{datum(eintrag.erstellt_am)}</span>
                    {neuester && <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800">Neuester</span>}
                    <span className="ml-2 font-mono text-xs text-muted-foreground">{eintrag.schluessel_id.slice(0, 12)}…</span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={kopieren}>
                    {kopiert ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {kopiert ? "Kopiert" : "Public Key kopieren"}
                </Button>
            </div>
            <textarea
                ref={feld}
                readOnly
                value={eintrag.public_key}
                rows={3}
                aria-label="Public Key"
                onFocus={(event) => event.target.select()}
                className={cn("w-full resize-none rounded-md border bg-muted/40 p-2 font-mono text-xs", !neuester && "sr-only")}
            />
        </div>
    );
}

// Schlüsselpaar der Check-in-App. Der private Schlüssel bleibt in der API, hier gibt es nur den Public Key.
export default function CheckinSchluessel() {
    const queryClient = useQueryClient();
    const status = useQuery(checkinStatusOptions);
    const schluessel = useQuery(checkinSchluesselOptions);
    const [nachfragen, setNachfragen] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const liste = schluessel.data ?? [];
    const automatisch = status.data?.public_key_automatisch === true;

    function erzeugen() {
        setNachfragen(false);
        startTransition(async () => {
            const antwort = await erzeugeCheckinSchluessel();
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setFehler(null);
            await queryClient.invalidateQueries({ queryKey: ["checkin"] });
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Check-in</CardTitle>
                <CardDescription>
                    Der Browser verschlüsselt die Kundendaten mit dem Public Key, nur die API kann sie mit dem privaten Schlüssel wieder lesen.{" "}
                    {automatisch ? (
                        "Die Check-in-App bekommt den neuesten Public Key automatisch über das gemeinsame Volume."
                    ) : (
                        <>Den Public Key von Hand als <code className="font-mono text-xs">CHECKIN_PUBLIC_KEY</code> in die Check-in-App eintragen und diese neu starten.</>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {status.data && (
                    <div className="space-y-1 text-sm">
                        {!status.data.eingerichtet && <p className="text-muted-foreground">Die Check-in-Datenbank ist nicht eingerichtet (CHECKIN_DB_HOST in der API).</p>}
                        {status.data.eingerichtet && !status.data.erreichbar && <p className="text-destructive">Die Check-in-Datenbank ist nicht erreichbar.</p>}
                        {status.data.erreichbar && <p className="text-muted-foreground">Datenbank erreichbar, {status.data.offen} offene Check-ins.</p>}
                        {automatisch && !status.data.public_key_bereitgestellt && liste.length > 0 && (
                            <p className="text-destructive">Der Public Key konnte nicht in den gemeinsamen Ordner geschrieben werden (CHECKIN_PUBLIC_KEY_ORDNER).</p>
                        )}
                        {status.data.ohne_schluessel > 0 && (
                            <p className="text-destructive">
                                {status.data.ohne_schluessel} Check-ins passen zu keinem Schlüssel hier. Stimmt der Public Key in der Check-in-App?
                            </p>
                        )}
                    </div>
                )}

                {schluessel.isError && <p className="text-sm text-destructive">{schluessel.error.message}</p>}
                {schluessel.data && liste.length === 0 && <p className="text-sm text-muted-foreground">Noch kein Schlüssel vorhanden.</p>}
                <div className="space-y-2">
                    {liste.map((eintrag, index) => (
                        <SchluesselZeile key={eintrag.schluessel_id} eintrag={eintrag} neuester={index === 0} />
                    ))}
                </div>

                {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                <Button type="button" variant="outline" disabled={isPending || !schluessel.data} onClick={() => (liste.length > 0 ? setNachfragen(true) : erzeugen())}>
                    <KeyRound className="h-4 w-4" />
                    {isPending ? "Wird erzeugt..." : "Neuen Schlüssel erzeugen"}
                </Button>

                <Dialog open={nachfragen} onOpenChange={setNachfragen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Neuen Schlüssel erzeugen?</DialogTitle>
                            <DialogDescription>
                                {automatisch
                                    ? "Die Check-in-App nutzt den neuen Public Key sofort. Wer das Formular gerade geöffnet hat, muss die Seite neu laden."
                                    : "Der neue Public Key gilt erst, wenn er von Hand in die Check-in-App eingetragen ist."}{" "}
                                Alte Schlüssel bleiben erhalten, bereits abgesendete Check-ins bleiben lesbar.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setNachfragen(false)}>Abbrechen</Button>
                            <Button type="button" onClick={erzeugen}>Erzeugen</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
