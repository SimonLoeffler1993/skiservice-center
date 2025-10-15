"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaisonContext } from "@/context/saison-context";
import { startTransition, use } from "react";
import { useSaisonverleihlisteContext } from "@/context/saisonverleihliste-context";

export default function SaisonWechseler() {
    const { saisonPromise } = useSaisonContext();
    const saison = use(saisonPromise);
    const { refreshSaisonverleihlistePromise } = useSaisonverleihlisteContext();

    const handleSaisonChange = (value: string) => {
        const selectedSaison = value;
        // console.log("Selected Saison:", selectedSaison);
        startTransition(() => refreshSaisonverleihlistePromise(Number(selectedSaison)));
    };

    // TODO Aktuelle Saison vorbelegen
    return (
        <div className="flex items-center gap-2">
            <Label>Saison</Label>
            <Select onValueChange={handleSaisonChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Saison auswählen" />
                </SelectTrigger>
                <SelectContent>
                    {saison.map((saison) => (
                        <SelectItem key={saison.ID} value={saison.ID.toString()}>
                            {saison.Name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}