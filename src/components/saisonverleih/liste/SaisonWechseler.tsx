"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaisonsNamenListe } from "@/types/saison";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SaisonWechselerProps = {
    saisons: SaisonsNamenListe;
    // Aktuell ausgewählte Saison
    selectedSaisonID?: number | null;
};

export default function SaisonWechseler({ saisons, selectedSaisonID }: SaisonWechselerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Andere Parameter (z.B. art) bleiben erhalten
    function wechseln(saisonID: string) {
        const parameter = new URLSearchParams(searchParams.toString());
        parameter.set("saison", saisonID);
        router.push(`${pathname}?${parameter}`);
    }

    return (
        <div className="flex items-center gap-2">
            <Label>Saison</Label>
            <Select onValueChange={wechseln} value={selectedSaisonID ? selectedSaisonID.toString() : undefined}>
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
