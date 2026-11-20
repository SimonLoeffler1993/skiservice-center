"use client";

import { useEffect, useState } from "react";
import { Delete } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PinFeldProps = {
    // Wird mit der PIN aufgerufen, sobald "OK" gedrückt wird (oder Enter)
    onFertig: (pin: string) => void;
    sperren?: boolean;
    laenge?: { min: number; max: number };
};

const TASTEN = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Großes Ziffernfeld für Tablets, auch per Tastatur bedienbar. */
export default function PinFeld({ onFertig, sperren = false, laenge = { min: 4, max: 8 } }: PinFeldProps) {
    const [pin, setPin] = useState("");

    const tippen = (ziffer: string) => setPin((alt) => (alt.length < laenge.max ? alt + ziffer : alt));
    const loeschen = () => setPin((alt) => alt.slice(0, -1));
    const fertig = () => {
        if (pin.length >= laenge.min && !sperren) {
            onFertig(pin);
            setPin("");
        }
    };

    useEffect(() => {
        const taste = (e: KeyboardEvent) => {
            if (sperren) return;
            if (/^\d$/.test(e.key)) setPin((alt) => (alt.length < laenge.max ? alt + e.key : alt));
            else if (e.key === "Backspace") setPin((alt) => alt.slice(0, -1));
            else if (e.key === "Enter") document.getElementById("pin-ok")?.click();
        };
        window.addEventListener("keydown", taste);
        return () => window.removeEventListener("keydown", taste);
    }, [sperren, laenge.max]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex h-6 gap-3" aria-label={`${pin.length} Ziffern eingegeben`}>
                {Array.from({ length: Math.max(laenge.min, pin.length) }).map((_, i) => (
                    <span key={i} className={cn("h-4 w-4 rounded-full border-2 border-primary", i < pin.length && "bg-primary")} />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
                {TASTEN.map((t) => (
                    <Button key={t} type="button" variant="outline" className="h-16 w-16 text-2xl" disabled={sperren} onClick={() => tippen(t)}>
                        {t}
                    </Button>
                ))}
                <Button type="button" variant="ghost" className="h-16 w-16" disabled={sperren || !pin} onClick={loeschen} aria-label="Ziffer löschen">
                    <Delete className="size-6" />
                </Button>
                <Button type="button" variant="outline" className="h-16 w-16 text-2xl" disabled={sperren} onClick={() => tippen("0")}>
                    0
                </Button>
                <Button id="pin-ok" type="button" className="h-16 w-16 text-lg" disabled={sperren || pin.length < laenge.min} onClick={fertig}>
                    OK
                </Button>
            </div>
        </div>
    );
}
