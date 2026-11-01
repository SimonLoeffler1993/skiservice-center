"use client";

import { useSyncExternalStore } from "react";
import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScannerGeraet } from "@/types/skiscanner";

const SPEICHER_SCHLUESSEL = "fertigstellen-scannername";
const EREIGNIS = "fertigstellen-scannername";
// Select-Wert für "Alle Scanner" (leere Werte erlaubt das Select nicht)
const ALLE = "__alle__";

function lesen(): string | null {
    try {
        return localStorage.getItem(SPEICHER_SCHLUESSEL) || null;
    } catch {
        return null;
    }
}

function abonnieren(neu: () => void) {
    window.addEventListener("storage", neu);
    window.addEventListener(EREIGNIS, neu);
    return () => {
        window.removeEventListener("storage", neu);
        window.removeEventListener(EREIGNIS, neu);
    };
}

// Scanner dieses Tablets, pro Gerät gespeichert (null = alle Scanner)
export function useScannerWahl(): [string | null, (name: string | null) => void] {
    const name = useSyncExternalStore(abonnieren, lesen, () => null);
    function setzen(neu: string | null) {
        try {
            if (neu) localStorage.setItem(SPEICHER_SCHLUESSEL, neu);
            else localStorage.removeItem(SPEICHER_SCHLUESSEL);
        } catch {
            // Ohne Speicher gilt die Wahl nur bis zum Neuladen
        }
        window.dispatchEvent(new Event(EREIGNIS));
    }
    return [name, setzen];
}

type ScannerAuswahlProps = {
    wahl: string | null;
    geraete: ScannerGeraet[];
    onWechsel: (name: string | null) => void;
};

// Zahnrad: legt fest, auf welchen Hardware-Scanner dieses Tablet hört
export default function ScannerAuswahl({ wahl, geraete, onWechsel }: ScannerAuswahlProps) {
    const namen = geraete.map((geraet) => geraet.name);
    // Gespeicherter Scanner bleibt wählbar, auch wenn er sich gerade nicht meldet
    if (wahl && !namen.includes(wahl)) namen.unshift(wahl);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" aria-label="Scanner dieses Tablets festlegen">
                    <Settings className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="space-y-2">
                <Label htmlFor="scanner-wahl">Scanner dieses Tablets</Label>
                <Select value={wahl ?? ALLE} onValueChange={(wert) => onWechsel(wert === ALLE ? null : wert)}>
                    <SelectTrigger id="scanner-wahl" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALLE}>Alle Scanner</SelectItem>
                        {namen.map((name) => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Angezeigt werden nur Status und Scans dieses Scanners. Der Name wird am Scanner bzw. im Webflasher eingetragen.
                </p>
            </PopoverContent>
        </Popover>
    );
}
