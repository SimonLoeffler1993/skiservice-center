"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";

type KundeTerminalAuswahlProps = {
    terminals: string[];
    selectedTerminal: string;
    setSelectedTerminal: (terminal: string) => void;
};

export default function KundeTerminalAuswahl({ terminals, selectedTerminal, setSelectedTerminal }: KundeTerminalAuswahlProps) {

    if (!terminals || terminals.length === 0) {
        return (
            <div className="flex items-center justify-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p>Keine Terminals verfügbar</p>
            </div>
        );
    }

    return (

        <RadioGroup value={selectedTerminal} onValueChange={setSelectedTerminal}>
            {terminals.map((terminal, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={terminal} />
                    <Label htmlFor={terminal}>{terminal}</Label>
                </div>
            ))}
        </RadioGroup>

    );
}