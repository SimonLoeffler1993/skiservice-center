import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaisonContext } from "@/context/saison-context";
import { use } from "react";

export default function SaisonWechseler() {
    const { saisonPromise } = useSaisonContext();
    const saison = use(saisonPromise);
    return (
        <div className="flex items-center gap-2">
            <Label>Saison</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Saison auswählen" />
                </SelectTrigger>
                <SelectContent>
                    {saison.map((saison) => (
                        <SelectItem key={saison.ID} value={saison.Name}>
                            {saison.Name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}