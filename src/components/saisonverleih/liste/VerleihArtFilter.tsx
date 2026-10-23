"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VerleihArt } from "@/types/saisonverleihtypes";

type VerleihArtFilterProps = {
    // Aktueller Filter, ohne Angabe alle
    art?: VerleihArt;
};

// Filter der Verleihliste, per URL vorbelegbar (?art=saison|tag). Die Saison bleibt erhalten.
export default function VerleihArtFilter({ art }: VerleihArtFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function wechseln(wert: string) {
        const parameter = new URLSearchParams(searchParams.toString());
        if (wert === "alle") parameter.delete("art");
        else parameter.set("art", wert);
        const query = parameter.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    return (
        <div className="flex items-center gap-2">
            <Label>Art</Label>
            <Select value={art ?? "alle"} onValueChange={wechseln}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="alle">Alle</SelectItem>
                    <SelectItem value="saison">Saisonverleih</SelectItem>
                    <SelectItem value="tag">Tagesverleih</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
