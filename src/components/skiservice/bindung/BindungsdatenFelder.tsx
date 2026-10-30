"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BindungsdatenEingabe, FAHRERTYPEN, FAHRKOENNEN_TEXT, groesseZuCm, hatBindungswerte, LEERE_BINDUNGSDATEN, cmZuMeterText } from "@/types/bindungsdatentypes";
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

    const mitWerten = hatBindungswerte(daten);

    // Geänderte Werte müssen vom Kunden neu bestätigt werden
    function aendern(feld: keyof BindungsdatenEingabe, neu: string) {
        if (daten[feld] === neu) return;
        onChange({ ...daten, [feld]: neu, bestaetigt: false });
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
                        // Übernommene Werte bestätigt der Kunde für diesen Auftrag neu
                        onChange({ ...eingabe, bestaetigt: false });
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
                    <Label htmlFor={`${idPrefix}-fahrkoennen`} className="text-xs">Fahrertyp</Label>
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
                            {FAHRERTYPEN.map((typ) => (
                                <SelectItem key={typ} value={typ}>{FAHRKOENNEN_TEXT[typ]}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {hinweis && daten.vorlage_id !== undefined && (
                <p className="text-xs text-muted-foreground">{hinweis}</p>
            )}
            {/* Pflicht, sobald ein Wert angegeben ist: der Kunde hat die Angaben geprüft */}
            {mitWerten && (
                <label
                    htmlFor={`${idPrefix}-bestaetigt`}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm ${daten.bestaetigt ? "border-green-200 bg-green-50 text-green-800" : "border-amber-300 bg-amber-50 text-amber-900"}`}
                >
                    <Checkbox
                        id={`${idPrefix}-bestaetigt`}
                        checked={daten.bestaetigt}
                        onCheckedChange={(wert) => onChange({ ...daten, bestaetigt: wert === true })}
                        disabled={deaktiviert}
                        className="h-5 w-5"
                    />
                    <span>
                        <span className="font-medium">Kunde hat die Angaben geprüft und bestätigt</span>
                        {!daten.bestaetigt && <span className="block text-xs">Pflicht zum Speichern der Bindungsdaten</span>}
                    </span>
                </label>
            )}
        </div>
    );
}
