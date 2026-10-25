"use client";

import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { entferneMaterial } from "@/lib/bearbeitenactions";
import { MaterialRead } from "@/types/materialtypes";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import MaterialBearbeitenDialog from "./MaterialBearbeitenDialog";
import { useVerleihAktualisieren } from "./useVerleihAktualisieren";

type MaterialAktionenProps = {
    verleih: SaisonverleihRead;
    material: MaterialRead;
    // Fahrer bzw. "Ausrüstung #n"
    bezeichnung: string;
    bezahlt: boolean;
    letztesMaterial: boolean;
};

export default function MaterialAktionen({ verleih, material, bezeichnung, bezahlt, letztesMaterial }: MaterialAktionenProps) {
    const aktualisieren = useVerleihAktualisieren(verleih.ID);

    return (
        <div className="flex gap-1">
            <MaterialBearbeitenDialog verleih={verleih} material={material} bezeichnung={bezeichnung} bezahlt={bezahlt} />
            <LoeschenDialog
                titel="Material entfernen"
                beschreibung="Das Material wird aus dem Verleih entfernt."
                deaktiviert={bezahlt || letztesMaterial}
                deaktiviertGrund={bezahlt ? "Verleih ist bezahlt" : "Letztes Material, bitte den Verleih löschen"}
                onLoeschen={async () => {
                    const antwort = await entferneMaterial(verleih.ID, material.ID);
                    if (!antwort.success) return antwort.error;
                    aktualisieren(antwort.data);
                    return null;
                }}
            />
        </div>
    );
}
