
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaisonpreisContext } from "@/context/saisonpreis-contex";
import { use } from "react";

export default function SaisonMaterialPreise() {
    const { saisonpreisePromise } = useSaisonpreisContext();
    const preise = use(saisonpreisePromise);
    
    return (
        <>
            <Label htmlFor="Saisonverleih" className="block text-sm font-medium text-gray-700 mb-1">Saisonverleih</Label>
            <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Saisonverleih" />
                </SelectTrigger>
                <SelectContent>
                    {preise.preise.map((preis) => (
                        <SelectItem key={preis.ID} value={preis.ID.toString()}>
                            {preis.Bezeichnung} - {preis.Preis}€
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}