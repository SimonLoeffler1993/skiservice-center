"use client"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { saisonverleihPreiseOptions } from "@/hooks/useSaisonverleihPreiseOptions";

interface SaisonMaterialPreiseProps {
    name: string;
    error?: string;
}

export default function SaisonMaterialPreise({ name, error }: SaisonMaterialPreiseProps) {
    const { watch, setValue } = useFormContext();
    const [isCustom, setIsCustom] = useState(false);

    const { data, isLoading, error: fetchError } = useQuery(saisonverleihPreiseOptions);

    const loadError = fetchError
        ? `Fehler beim Laden der Preise: ${fetchError.message}`
        : data && !data.success
            ? "Preise konnten nicht geladen werden"
            : null;

    const preise = data?.success ? data.data.preise : [];
    const disabled = isLoading || !!loadError;

    // Form stores the numeric Preis
    const selectedValue = watch(name) as number | undefined;
    const selectValue = isCustom
        ? 'custom'
        : typeof selectedValue === 'number' && selectedValue > 0
            ? String(selectedValue)
            : undefined;

    const handleValueChange = (value: string) => {
        if (value === 'custom') {
            setIsCustom(true);
            // Initialize with 0 so validation will require a positive custom price
            setValue(name, 0, { shouldValidate: true });
        } else {
            setIsCustom(false);
            const num = Number(value);
            setValue(name, isNaN(num) ? 0 : num, { shouldValidate: true });
        }
    };

    const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = Number(e.target.value);
        setValue(name, isNaN(price) ? 0 : price, { shouldValidate: true });
    };

    return (
        <div className="min-w-0">
            <Label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                Saisonverleih
            </Label>
            <div className="space-y-2">
                <Select
                    value={selectValue}
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
                            <SelectItem key={preis.ID} value={preis.Preis.toString()}>
                                {preis.Bezeichnung} - {preis.Preis}€
                            </SelectItem>
                        ))}
                        <SelectItem key="custom" value="custom">
                            Individueller Preis
                        </SelectItem>
                    </SelectContent>
                </Select>

                {isCustom && (
                    <div>
                        <Input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            placeholder="Preis in Euro, z. B. 12.50"
                            value={typeof selectedValue === 'number' && selectedValue > 0 ? selectedValue : ''}
                            onChange={handleCustomPriceChange}
                            className={error ? 'border-red-500' : ''}
                        />
                    </div>
                )}

                {loadError && (
                    <p className="text-sm text-red-600">{loadError}</p>
                )}
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        </div>
    );
}