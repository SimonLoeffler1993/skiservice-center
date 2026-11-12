"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type VerleihStatus = "alle" | "frei" | "verleih"

// Leerer String = kein Filter
export type MaterialFilterWerte = {
    hersteller: string
    modell: string
    zusatz: string
    von: string
    bis: string
    saison: string
    status: VerleihStatus
}

export const LEERER_FILTER: MaterialFilterWerte = {
    hersteller: "",
    modell: "",
    zusatz: "",
    von: "",
    bis: "",
    saison: "",
    status: "alle",
}

export type FilterOption = { wert: string; text: string }

// Radix-Select erlaubt keinen leeren Wert, daher steht "alle" für keinen Filter
const ALLE = "alle"

// Zahl aus der Eingabe, Komma als Dezimaltrennzeichen erlaubt; leer oder ungültig = null
export function zahlAusFilter(wert: string): number | null {
    if (wert.trim() === "") return null
    const zahl = Number(wert.replace(",", "."))
    return Number.isNaN(zahl) ? null : zahl
}

// Prüft Maß (von/bis), Saison und Verleihstatus, die für Ski und Schuhe gleich sind
export function passtAllgemein(werte: MaterialFilterWerte, mass: number, saison: string, imVerleih: boolean): boolean {
    const von = zahlAusFilter(werte.von)
    const bis = zahlAusFilter(werte.bis)
    if (von !== null && mass < von) return false
    if (bis !== null && mass > bis) return false
    if (werte.saison && saison !== werte.saison) return false
    if (werte.status === "frei" && imVerleih) return false
    if (werte.status === "verleih" && !imVerleih) return false
    return true
}

// Eindeutige, sortierte Optionen aus einer Liste
export function eindeutigeOptionen(eintraege: FilterOption[]): FilterOption[] {
    const map = new Map<string, string>()
    for (const e of eintraege) map.set(e.wert, e.text)
    return [...map.entries()]
        .map(([wert, text]) => ({ wert, text }))
        .sort((a, b) => a.text.localeCompare(b.text, "de"))
}

const STATUS_OPTIONEN: { wert: VerleihStatus; text: string }[] = [
    { wert: "alle", text: "Alle" },
    { wert: "frei", text: "Frei" },
    { wert: "verleih", text: "Im Verleih" },
]

type MaterialFilterProps = {
    werte: MaterialFilterWerte
    onChange: (werte: MaterialFilterWerte) => void
    hersteller: FilterOption[]
    // Bereits auf den gewählten Hersteller eingeschränkt
    modelle: FilterOption[]
    zusatz: { label: string; optionen: FilterOption[] }
    saisons: FilterOption[]
    massLabel: string
    masseinheit: string
    anzahl: number
    gesamt: number
    // Zusätzliche Bedienelemente, z.B. "Ausgemusterte anzeigen"
    children?: React.ReactNode
}

export default function MaterialFilter({
    werte,
    onChange,
    hersteller,
    modelle,
    zusatz,
    saisons,
    massLabel,
    masseinheit,
    anzahl,
    gesamt,
    children,
}: MaterialFilterProps) {
    const setze = (teil: Partial<MaterialFilterWerte>) => onChange({ ...werte, ...teil })
    const aktiv =
        werte.hersteller !== "" ||
        werte.modell !== "" ||
        werte.zusatz !== "" ||
        werte.von !== "" ||
        werte.bis !== "" ||
        werte.saison !== "" ||
        werte.status !== "alle"

    return (
        <div className="space-y-3 rounded-lg border bg-card p-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <AuswahlFeld
                    label="Hersteller"
                    wert={werte.hersteller}
                    optionen={hersteller}
                    // Modell passt nach Herstellerwechsel meist nicht mehr
                    onChange={(wert) => setze({ hersteller: wert, modell: "" })}
                />
                <AuswahlFeld label="Modell" wert={werte.modell} optionen={modelle} onChange={(wert) => setze({ modell: wert })} />
                <AuswahlFeld label={zusatz.label} wert={werte.zusatz} optionen={zusatz.optionen} onChange={(wert) => setze({ zusatz: wert })} />
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{massLabel} von ({masseinheit})</Label>
                    <Input type="number" inputMode="decimal" step="any" value={werte.von} onChange={(e) => setze({ von: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{massLabel} bis ({masseinheit})</Label>
                    <Input type="number" inputMode="decimal" step="any" value={werte.bis} onChange={(e) => setze({ bis: e.target.value })} />
                </div>
                <AuswahlFeld label="Saison" wert={werte.saison} optionen={saisons} onChange={(wert) => setze({ saison: wert })} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div role="radiogroup" aria-label="Verleihstatus" className="inline-flex rounded-lg bg-muted p-1">
                    {STATUS_OPTIONEN.map(({ wert, text }) => (
                        <button
                            key={wert}
                            type="button"
                            role="radio"
                            aria-checked={werte.status === wert}
                            onClick={() => setze({ status: wert })}
                            className={cn(
                                "h-8 rounded-md px-4 text-sm font-medium transition-colors",
                                werte.status === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {text}
                        </button>
                    ))}
                </div>
                {children}
                <span className="ml-auto text-sm text-muted-foreground">
                    {anzahl} von {gesamt}
                </span>
                {aktiv && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => onChange(LEERER_FILTER)}>
                        <X className="size-4" />
                        Zurücksetzen
                    </Button>
                )}
            </div>
        </div>
    )
}

function AuswahlFeld({
    label,
    wert,
    optionen,
    onChange,
}: {
    label: string
    wert: string
    optionen: FilterOption[]
    onChange: (wert: string) => void
}) {
    return (
        <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <Select value={wert === "" ? ALLE : wert} onValueChange={(neu) => onChange(neu === ALLE ? "" : neu)}>
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALLE}>Alle</SelectItem>
                    {optionen.map((o) => (
                        <SelectItem key={o.wert} value={o.wert}>
                            {o.text}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
