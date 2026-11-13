"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBildschirmAn } from "@/hooks/useBildschirmAn";
import { werkstattUrl, type WerkstattAnsicht } from "./werkstattUrl";

const DAUER_AUSWAHL = [10, 20, 30, 60];

type AutoWechselProps = {
    ansicht: WerkstattAnsicht;
    auto: boolean;
    sekunden: number;
};

// Hält den Bildschirm an, solange automatisch gewechselt wird (Bildschirm in der Werkstatt)
function BildschirmAn() {
    useBildschirmAn();
    return null;
}

// Häkchen "Automatisch wechseln" mit Dauer. Beides steht nur in der URL,
// so lässt sich die Seite fertig eingestellt als Lesezeichen ablegen
export default function AutoWechsel({ ansicht, auto, sekunden }: AutoWechselProps) {
    const router = useRouter();
    const balken = useRef<HTMLDivElement>(null);

    // Nach Ablauf zur anderen Ansicht, der Balken zeigt die Restzeit.
    // Ein Wechsel von Hand startet die Zeit neu
    useEffect(() => {
        if (!auto) return;
        const naechste: WerkstattAnsicht = ansicht === "service" ? "verleih" : "service";
        const animation = balken.current?.animate(
            [{ width: "0%" }, { width: "100%" }],
            { duration: sekunden * 1000, easing: "linear", fill: "forwards" },
        );
        const timer = setTimeout(() => {
            router.replace(werkstattUrl(naechste, true, sekunden), { scroll: false });
        }, sekunden * 1000);
        return () => {
            clearTimeout(timer);
            animation?.cancel();
        };
    }, [ansicht, auto, sekunden, router]);

    // Ein Wert aus der URL, der nicht in der Liste steht, bleibt auswählbar
    const auswahl = DAUER_AUSWAHL.includes(sekunden) ? DAUER_AUSWAHL : [...DAUER_AUSWAHL, sekunden].sort((a, b) => a - b);

    return (
        <div className="flex flex-col items-stretch gap-1.5">
            {auto && <BildschirmAn />}
            <div className="flex items-center gap-3">
                <Label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm font-normal">
                    <Checkbox
                        className="size-5"
                        checked={auto}
                        onCheckedChange={(wert) => router.replace(werkstattUrl(ansicht, wert === true, sekunden), { scroll: false })}
                    />
                    Automatisch wechseln
                </Label>
                <Select
                    value={String(sekunden)}
                    disabled={!auto}
                    onValueChange={(wert) => router.replace(werkstattUrl(ansicht, auto, Number(wert)), { scroll: false })}
                >
                    <SelectTrigger className="h-10 data-[size=default]:h-10" aria-label="Dauer je Ansicht">
                        <SelectValue>{sekunden} s</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {auswahl.map((dauer) => (
                            <SelectItem key={dauer} value={String(dauer)}>{dauer} s</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Restzeit bis zum nächsten Wechsel */}
            <div className={`h-1 overflow-hidden rounded-full bg-muted ${auto ? "" : "invisible"}`} aria-hidden>
                <div ref={balken} className="h-full w-0 rounded-full bg-primary/60" />
            </div>
        </div>
    );
}
