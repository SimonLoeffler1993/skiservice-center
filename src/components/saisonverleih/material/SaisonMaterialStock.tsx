"use client"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

import { skiStoeckeOptions } from "@/hooks/useSchuhMaterialOptions";

interface SaisonMaterialStockProps {
    value?: number;
    onChange: (value: string) => void;
    error?: string;
}

export default function SaisonMaterialStock({ value, onChange, error }: SaisonMaterialStockProps) {
    const { data, isLoading, error: fetchError } = useQuery(skiStoeckeOptions);

    const loadError = fetchError
        ? `Fehler beim Laden der Stöcke: ${fetchError.message}`
        : data && !data.success
            ? "Stöcke konnten nicht geladen werden"
            : null;

    const stoecke = data?.success ? data.data : [];
    const disabled = isLoading || !!loadError;

    return (
        <div className="min-w-0">
            <Label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
            </Label>
            <Select
                value={value?.toString()}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger
                    id="stock"
                    className={`w-full ${error ? 'border-red-500' : ''}`}
                >
                    <SelectValue placeholder={isLoading ? "Lädt..." : "Stock wählen..."} />
                </SelectTrigger>
                <SelectContent>
                    {stoecke.map((stock) => (
                        <SelectItem key={stock.ID} value={stock.ID.toString()}>
                            {stock.Bezeichnung}
                        </SelectItem>
                    ))}
                    <SelectItem value="-1">
                        kein Stock
                    </SelectItem>
                </SelectContent>
            </Select>
            {loadError && (
                <p className="mt-1 text-sm text-red-600">{loadError}</p>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}