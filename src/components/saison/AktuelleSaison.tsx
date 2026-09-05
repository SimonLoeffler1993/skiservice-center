"use client";

import { SaisonsNamen } from "@/types/saison";
import { DialogSaisonErfassen } from "./DialogSaisonErfassen";

type AktuelleSaisonProps = {
    saison: SaisonsNamen | undefined;
}

export default function AktuelleSaison({ saison }: AktuelleSaisonProps) {

    if (!saison) {
        return (
            <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-100">
                <h2 className="text-2xl">Keine Saison gefunden!</h2>
                <DialogSaisonErfassen />
            </div>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-4 py-1.5 text-base font-medium text-neutral-700">
            {saison.Name}
        </span>
    );
}