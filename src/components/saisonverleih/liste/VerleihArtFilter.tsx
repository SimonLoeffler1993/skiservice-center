"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { VerleihArt } from "@/types/saisonverleihtypes";

type VerleihArtFilterProps = {
    // Aktueller Filter, ohne Angabe alle
    art?: VerleihArt;
};

const OPTIONEN: { wert: VerleihArt | "alle"; text: string }[] = [
    { wert: "alle", text: "Alle" },
    { wert: "saison", text: "Saison" },
    { wert: "tag", text: "Tag" },
];

// Filter der Verleihliste als Segment-Umschalter, per URL vorbelegbar (?art=saison|tag). Die Saison bleibt erhalten.
export default function VerleihArtFilter({ art }: VerleihArtFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const aktuell = art ?? "alle";

    function wechseln(wert: string) {
        const parameter = new URLSearchParams(searchParams.toString());
        if (wert === "alle") parameter.delete("art");
        else parameter.set("art", wert);
        const query = parameter.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    return (
        <div role="radiogroup" aria-label="Art" className="inline-flex rounded-lg bg-muted p-1">
            {OPTIONEN.map(({ wert, text }) => (
                <button
                    key={wert}
                    type="button"
                    role="radio"
                    aria-checked={aktuell === wert}
                    onClick={() => wechseln(wert)}
                    className={cn(
                        "h-8 rounded-md px-4 text-sm font-medium transition-colors",
                        aktuell === wert ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                >
                    {text}
                </button>
            ))}
        </div>
    );
}
