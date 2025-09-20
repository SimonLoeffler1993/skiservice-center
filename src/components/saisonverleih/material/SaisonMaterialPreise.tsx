"use client"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSaisonpreisContext } from "@/context/saisonpreis-contex";
import { use, useState } from "react";
import { useFormContext } from "react-hook-form";

interface SaisonMaterialPreiseProps {
    name: string;
    error?: string;
}

export default function SaisonMaterialPreise({ name, error }: SaisonMaterialPreiseProps) {
    const { saisonpreisePromise } = useSaisonpreisContext();
    const preise = use(saisonpreisePromise);
    const { watch, setValue } = useFormContext();
    const [isCustom, setIsCustom] = useState(false);

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
        <div>
            <Label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                Saisonverleih
            </Label>
            <div className="space-y-2">
                <Select 
                    value={selectValue}
                    onValueChange={handleValueChange}
                >
                    <SelectTrigger className={error ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Preis auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                        {preise.preise.map((preis) => (
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
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Individueller Preis eingeben"
                            value={typeof selectedValue === 'number' && selectedValue > 0 ? selectedValue : ''}
                            onChange={handleCustomPriceChange}
                            className={error ? 'border-red-500' : ''}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Bitte geben Sie den individuellen Preis in Euro ein (z.B. 12.50)
                        </p>
                    </div>
                )}
                
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        </div>
    );
}