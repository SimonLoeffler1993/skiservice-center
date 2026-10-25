"use client"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { saisonverleihPreiseOptions } from "@/hooks/useSaisonverleihPreiseOptions";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";

interface SaisonMaterialPreiseProps {
    name: string;
    error?: string;
    // Beim Bearbeiten "custom", damit der bisherige Betrag im Feld steht
    startAuswahl?: string;
    // Preis darf nicht mehr geändert werden (Verleih bezahlt)
    gesperrt?: boolean;
}

export default function SaisonMaterialPreise({ name, error, startAuswahl, gesperrt = false }: SaisonMaterialPreiseProps) {
    const { watch, setValue } = useFormContext();
    const { art } = useSaisonverleihContext();
    // Ausgewählte Preis-ID, damit zwei Preise mit gleichem Betrag unterscheidbar sind
    const [auswahl, setAuswahl] = useState<string | undefined>(startAuswahl);

    const { data, isLoading, error: fetchError } = useQuery(saisonverleihPreiseOptions);

    const loadError = fetchError
        ? `Fehler beim Laden der Preise: ${fetchError.message}`
        : data && !data.success
            ? "Preise konnten nicht geladen werden"
            : null;

    const preise = data?.success ? data.data.preise.filter((preis) => !preis.inaktiv) : [];
    const disabled = isLoading || !!loadError || gesperrt;

    // Form stores the numeric Preis
    const selectedValue = watch(name) as number | undefined;
    // Beim Tagesverleih wird der Preis immer frei eingetragen
    const isCustom = art === "tag" || auswahl === "custom";

    const handleValueChange = (value: string) => {
        setAuswahl(value);
        if (value === 'custom') {
            // Initialize with 0 so validation will require a positive custom price
            setValue(name, 0, { shouldValidate: true });
        } else {
            const preis = preise.find((p) => String(p.ID) === value);
            setValue(name, preis?.Preis ?? 0, { shouldValidate: true });
        }
    };

    const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = Number(e.target.value);
        setValue(name, isNaN(price) ? 0 : price, { shouldValidate: true });
    };

    return (
        <div className="min-w-0">
            <Label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {art === "tag" ? "Preis Tagesverleih (gesamter Zeitraum)" : "Saisonverleih"}
            </Label>
            <div className="space-y-2">
                {art === "saison" && (
                    <Select
                        value={auswahl ?? ""}
                        onValueChange={handleValueChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            id={name}
                            className={`w-full ${error ? 'border-red-500' : ''}`}
                        >
                            <SelectValue placeholder={isLoading ? "Lädt..." : "Preis auswählen..."} />
                        </SelectTrigger>
                        <SelectContent>
                            {preise.map((preis) => (
                                <SelectItem key={preis.ID} value={String(preis.ID)}>
                                    {preis.Bezeichnung} - {preis.Preis}€
                                </SelectItem>
                            ))}
                            <SelectItem key="custom" value="custom">
                                Individueller Preis
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {isCustom && (
                    <div>
                        <Input
                            id={art === "tag" ? name : undefined}
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            placeholder="Preis in Euro, z. B. 12.50"
                            value={typeof selectedValue === 'number' && selectedValue > 0 ? selectedValue : ''}
                            onChange={handleCustomPriceChange}
                            disabled={gesperrt}
                            className={error ? 'border-red-500' : ''}
                        />
                    </div>
                )}

                {gesperrt && (
                    <p className="text-sm text-muted-foreground">Verleih ist bezahlt, der Preis kann nicht mehr geändert werden.</p>
                )}
                {loadError && art === "saison" && (
                    <p className="text-sm text-red-600">{loadError}</p>
                )}
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        </div>
    );
}
