"use client"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SaisonMaterialStockProps {
    value?: number;
    onChange: (value: string) => void;
    error?: string;
}

export default function SaisonMaterialStock({ value, onChange, error }: SaisonMaterialStockProps) {
    return (
        <div>
            <Label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
            </Label>
            <Select 
                value={value?.toString()}
                onValueChange={onChange}
            >
                <SelectTrigger className={error ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Stock wählen..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">
                        Stock
                    </SelectItem>
                    <SelectItem value="-1">
                        kein Stock
                    </SelectItem>
                </SelectContent>
            </Select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}