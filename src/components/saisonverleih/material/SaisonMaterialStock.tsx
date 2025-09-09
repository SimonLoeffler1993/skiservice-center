"use client"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function SaisonMaterialStock() {
    return (
        <>
            <Label htmlFor="Stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</Label>
            <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
   
                        <SelectItem value="Stock">
                            Stock
                        </SelectItem>
     
                </SelectContent>
            </Select>
        </>
    );
}