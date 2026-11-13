"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { testeMailvorlage } from "@/lib/mailvorlagenactions";
import { TestErgebnis } from "@/types/einstellungentypes";

type TestMailProps = {
    schluessel: string;
    // Ungespeicherte Änderungen werden beim Test nicht verwendet
    hatAenderungen: boolean;
}

export default function TestMail({ schluessel, hatAenderungen }: TestMailProps) {
    const [isPending, startTransition] = useTransition();
    const [ergebnis, setErgebnis] = useState<TestErgebnis | null>(null);
    const [empfaenger, setEmpfaenger] = useState("");

    function testen() {
        startTransition(async () => {
            setErgebnis(await testeMailvorlage(schluessel, empfaenger));
        });
    }

    return (
        <div className="flex flex-col gap-2 rounded-md border border-dashed p-3">
            <p className="text-sm font-medium">Zur Probe an mich selbst senden</p>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input type="email" placeholder="Meine E-Mail Adresse" value={empfaenger} onChange={(e) => setEmpfaenger(e.target.value)} />
                <Button type="button" variant="secondary" disabled={isPending || hatAenderungen || !empfaenger} onClick={testen}>
                    {isPending ? "Sende..." : "Test-Mail senden"}
                </Button>
            </div>
            <p className="text-sm text-muted-foreground">
                {hatAenderungen ? "Bitte zuerst speichern, gesendet wird der gespeicherte Text." : "Die Mail enthält Beispieldaten, kein Kunde bekommt sie."}
            </p>
            {ergebnis && <p className={ergebnis.success ? "text-sm text-green-700" : "text-sm text-destructive"}>{ergebnis.message}</p>}
        </div>
    );
}
