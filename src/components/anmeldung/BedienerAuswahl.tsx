"use client";

import { useState } from "react";
import { ArrowLeft, LogOut, UserRound } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { geraetAbmelden, pinAnmelden } from "@/lib/anmeldungactions";
import type { AuthStatus, Kachel } from "@/types/anmeldung";
import AnmeldeFormular from "./AnmeldeFormular";
import { sicheresZiel } from "./anmeldeziel";
import PinFeld from "./PinFeld";

type BedienerAuswahlProps = {
    status: AuthStatus | null;
    kacheln: Kachel[];
    geraetName: string | null;
    zurueck?: string | null;
    fehler?: string | null;
};

/**
 * Bedienerwechsel auf einem angemeldeten Gerät. Standard: Benutzername + Passwort (oder OIDC).
 * Wer sich unter „Mein Konto“ eine PIN festgelegt hat, erscheint zusätzlich als Kachel.
 */
export default function BedienerAuswahl({ status, kacheln, geraetName, zurueck, fehler: anfangsFehler }: BedienerAuswahlProps) {
    const [gewaehlt, setGewaehlt] = useState<Kachel | null>(null);
    const [fehler, setFehler] = useState<string | null>(null);
    const [laeuft, setLaeuft] = useState(false);

    const mitPin = async (pin: string) => {
        if (!gewaehlt) return;
        setLaeuft(true);
        setFehler(null);
        const antwort = await pinAnmelden(gewaehlt.id, pin);
        if (!antwort.success) {
            setFehler(antwort.error);
            setLaeuft(false);
            return;
        }
        window.location.href = antwort.data.passwort_aendern ? "/konto?pflicht=1" : sicheresZiel(zurueck);
    };

    const abmelden = async () => {
        if (!window.confirm("Dieses Gerät abmelden? Danach ist eine neue Anmeldung mit Passwort nötig.")) return;
        await geraetAbmelden();
        window.location.href = "/anmelden";
    };

    if (gewaehlt) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => { setGewaehlt(null); setFehler(null); }}>
                    <ArrowLeft /> Andere Person
                </Button>
                <p className="text-center text-lg font-medium">{gewaehlt.anzeigename}</p>
                {fehler && (
                    <Alert variant="destructive">
                        <AlertDescription>{fehler}</AlertDescription>
                    </Alert>
                )}
                <PinFeld onFertig={mitPin} sperren={laeuft} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {kacheln.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Schnellwahl mit PIN</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {kacheln.map((k) => (
                            <Button key={k.id} variant="outline" className="h-20 flex-col gap-1" onClick={() => setGewaehlt(k)}>
                                <UserRound className="size-6" />
                                <span className="truncate">{k.anzeigename}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            <AnmeldeFormular status={status} zurueck={zurueck} fehler={anfangsFehler} geraetAngemeldet />
            <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span>Gerät: {geraetName ?? "unbekannt"}</span>
                <Button variant="ghost" size="sm" onClick={abmelden}>
                    <LogOut /> Gerät abmelden
                </Button>
            </div>
        </div>
    );
}
