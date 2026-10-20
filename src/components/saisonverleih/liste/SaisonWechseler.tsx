"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaisonsNamenListe } from "@/types/saison";
import { useRouter } from "next/navigation";

type SaisonWechselerProps = {
    saisons: SaisonsNamenListe;
    // Aktuell ausgewählte Saison
    selectedSaisonID?: number | null;
};

export default function SaisonWechseler({ saisons, selectedSaisonID }: SaisonWechselerProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-2">
            <Label>Saison</Label>
            <Select onValueChange={(value) => router.push(`?saison=${value}`)} value={selectedSaisonID ? selectedSaisonID.toString() : undefined}>
                <SelectTrigger>
                    <SelectValue placeholder="Saison auswählen" />
                </SelectTrigger>
                <SelectContent>
                    {saisons.map((saison) => (
                        <SelectItem key={saison.ID} value={saison.ID.toString()}>
                            {saison.Name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
