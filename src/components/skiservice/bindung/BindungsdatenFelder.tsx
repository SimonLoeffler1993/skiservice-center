"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BindungsdatenEingabe, FAHRKOENNEN_TEXT, groesseZuCm, LEERE_BINDUNGSDATEN, cmZuMeterText } from "@/types/bindungsdatentypes";
import LetzteBindungsdatenDialog from "./LetzteBindungsdatenDialog";

type BindungsdatenFelderProps = {
    // Eindeutiger Teil für die IDs der Felder
    idPrefix: string;
    wert: BindungsdatenEingabe | undefined;
    onChange: (wert: BindungsdatenEingabe) => void;
    kundeId: number | undefined;
    deaktiviert?: boolean;
};

const ZAHLENFELDER: { feld: "Sohle" | "Gewicht" | "Groesse" | "Alter"; label: string; platzhalter: string }[] = [
    { feld: "Sohle", label: "Sohle (mm)", platzhalter: "z.B. 305" },
    { feld: "Gewicht", label: "Gewicht (kg)", platzhalter: "z.B. 75" },
    { feld: "Groesse", label: "Größe (m)", platzhalter: "z.B. 180" },
    { feld: "Alter", label: "Alter", platzhalter: "z.B. 34" },
];

// Optionale Bindungsdaten eines Ski, alle Felder sind Texte und werden beim Speichern umgewandelt
export default function BindungsdatenFelder({ idPrefix, wert, onChange, kundeId, deaktiviert = false }: BindungsdatenFelderProps) {
    const daten = wert ?? LEERE_BINDUNGSDATEN;
    const [hinweis, setHinweis] = useState<string | null>(null);

    function aendern(feld: keyof BindungsdatenEingabe, neu: string) {
        onChange({ ...daten, [feld]: neu });
    }

    // Größe beim Verlassen des Feldes als Meter anzeigen, z.B. "180" -> "1,80"
    function groesseFormatieren() {
        const cm = groesseZuCm(daten.Groesse);
        if (cm !== null && !Number.isNaN(cm) && cm >= 80 && cm <= 230) {
            const text = cmZuMeterText(cm);
            if (text !== daten.Groesse) aendern("Groesse", text);
        }
    }

    return (
        // @container: Spaltenzahl richtet sich nach der verfügbaren Breite, auch im Dialog
        <div className="@container space-y-3 rounded-md bg-muted/50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">Bindungsdaten (optional)</p>
                <LetzteBindungsdatenDialog
                    kundeId={kundeId}
                    deaktiviert={deaktiviert}
                    onUebernehmen={(eingabe, text) => {
                        onChange(eingabe);
                        setHinweis(text);
                    }}
                />
            </div>
            <div className="grid grid-cols-2 gap-3 @md:grid-cols-3 @4xl:grid-cols-6">
                <div className="col-span-2 space-y-1 @md:col-span-1">
                    <Label htmlFor={`${idPrefix}-fahrer`} className="text-xs">Fahrer</Label>
                    <Input
                        id={`${idPrefix}-fahrer`}
                        value={daten.Fahrer}
                        onChange={(e) => aendern("Fahrer", e.target.value)}
                        placeholder="Name"
                        maxLength={100}
                        disabled={deaktiviert}
                    />
                </div>
                {ZAHLENFELDER.map(({ feld, label, platzhalter }) => (
                    <div key={feld} className="space-y-1">
                        <Label htmlFor={`${idPrefix}-${feld}`} className="text-xs">{label}</Label>
                        <Input
                            id={`${idPrefix}-${feld}`}
                            inputMode="decimal"
                            value={daten[feld]}
                            onChange={(e) => aendern(feld, e.target.value)}
                            onBlur={feld === "Groesse" ? groesseFormatieren : undefined}
                            placeholder={platzhalter}
                            disabled={deaktiviert}
                        />
                    </div>
                ))}
                <div className="col-span-2 space-y-1 @md:col-span-1">
                    <Label htmlFor={`${idPrefix}-fahrkoennen`} className="text-xs">Fahrkönnen</Label>
                    <Select
                        value={daten.Fahrkoennen}
                        onValueChange={(neu) => aendern("Fahrkoennen", neu === "leer" ? "" : neu)}
                        disabled={deaktiviert}
                    >
                        <SelectTrigger id={`${idPrefix}-fahrkoennen`} className="w-full">
                            <SelectValue placeholder="Typ wählen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="leer">keine Angabe</SelectItem>
                            {Object.entries(FAHRKOENNEN_TEXT).map(([typ, text]) => (
                                <SelectItem key={typ} value={typ}>{text}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {hinweis && daten.vorlage_id !== undefined && (
                <p className="text-xs text-muted-foreground">{hinweis}</p>
            )}
        </div>
    );
}
