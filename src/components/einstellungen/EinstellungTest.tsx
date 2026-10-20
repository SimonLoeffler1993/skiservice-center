"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestArt, testeEinstellung } from "@/lib/einstellungenactions";
import { TestErgebnis } from "@/types/einstellungentypes";

type EinstellungTestProps = {
    art: TestArt;
    // Ungespeicherte Änderungen werden beim Test nicht verwendet
    hatAenderungen: boolean;
}

const BESCHRIFTUNG: Record<TestArt, string> = {
    mail: "Test-Mail senden",
    drucker: "Test-Etikett drucken",
    lexware: "Verbindung testen",
};

export default function EinstellungTest({ art, hatAenderungen }: EinstellungTestProps) {
    const [isPending, startTransition] = useTransition();
    const [ergebnis, setErgebnis] = useState<TestErgebnis | null>(null);
    const [empfaenger, setEmpfaenger] = useState("");

    function testen() {
        startTransition(async () => {
            setErgebnis(await testeEinstellung(art, empfaenger));
        });
    }

    return (
        <div className="flex flex-col gap-2 rounded-md border border-dashed p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
                {art === "mail" && (
                    <Input
                        type="email"
                        placeholder="Empfänger für Test-Mail"
                        value={empfaenger}
                        onChange={(e) => setEmpfaenger(e.target.value)}
                    />
                )}
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending || hatAenderungen || (art === "mail" && !empfaenger)}
                    onClick={testen}
                >
                    {isPending ? "Teste..." : BESCHRIFTUNG[art]}
                </Button>
            </div>
            {hatAenderungen && (
                <p className="text-sm text-muted-foreground">Bitte zuerst speichern, getestet werden die gespeicherten Werte.</p>
            )}
            {ergebnis && (
                <p className={ergebnis.success ? "text-sm text-green-700" : "text-sm text-destructive"}>
                    {ergebnis.message}
                </p>
            )}
        </div>
    );
}
