"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useSaisonContext } from "@/context/saison-context";
// import { startTransition, use } from "react";
// import { useSaisonverleihlisteContext } from "@/context/saisonverleihliste-context";
import { SaisonsNamenListe } from "@/types/saison";
import { useRouter } from "next/navigation";

type SaisonWechselerProps = {
    // Optional: Aktuelle Saison ID, um sie als Standardwert zu setzen
    saisons: SaisonsNamenListe;
    selectedSaisonID?: number | null;
};

export default function SaisonWechseler({ saisons, selectedSaisonID }: SaisonWechselerProps) {
    const router = useRouter();
    // const { saisonPromise } = useSaisonContext();
    // const saison = use(saisonPromise);
    // const { refreshSaisonverleihlistePromise } = useSaisonverleihlisteContext();

    // const handleSaisonChange = (value: string) => {
    //     const selectedSaison = value;
    //     // console.log("Selected Saison:", selectedSaison);
    //     startTransition(() => refreshSaisonverleihlistePromise(Number(selectedSaison)));
    // };

    // TODO Aktuelle Saison vorbelegen

    console.log(selectedSaisonID);

    return (
        <div className="flex items-center gap-2">
            <Label>Saison</Label>
            {/* <Select onValueChange={handleSaisonChange}> */}
            <Select onValueChange={(value) => router.push(`?saison=${value}`)} defaultValue={selectedSaisonID ? selectedSaisonID.toString() : undefined}>
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