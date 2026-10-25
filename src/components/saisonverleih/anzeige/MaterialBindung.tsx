"use client";

import BindungsdatenBearbeitenDialog from "@/components/skiservice/bindung/BindungsdatenBearbeitenDialog";
import { aendereMaterial } from "@/lib/bearbeitenactions";
import { MaterialRead } from "@/types/materialtypes";
import { useVerleihAktualisieren } from "../bearbeiten/useVerleihAktualisieren";

type MaterialBindungProps = {
    verleihId: number;
    material: MaterialRead;
    kundeId: number;
};

// Bindungsdaten einer Materialzeile erfassen und bearbeiten, auch nach dem Bezahlen
export default function SaisonVerleiAnzeigeMaterialBindung({ verleihId, material, kundeId }: MaterialBindungProps) {
    const aktualisieren = useVerleihAktualisieren(verleihId);

    return (
        <BindungsdatenBearbeitenDialog
            titel={material.SkiFahrerName || `Ausrüstung #${material.ID}`}
            idPrefix={`material-${material.ID}`}
            bindungsdaten={material.bindungsdaten}
            kundeId={kundeId}
            // Fahrer vom Skifahrernamen, Sohle vom Leihschuh
            vorschlag={{
                Fahrer: material.SkiFahrerName ?? "",
                Sohle: material.Schuh?.Sohle ? String(material.Schuh.Sohle) : "",
            }}
            onSpeichern={async (daten, vorlageId) => {
                const antwort = await aendereMaterial(verleihId, material.ID, { bindungsdaten: daten, vorlage_id: vorlageId });
                if (!antwort.success) return antwort.error;
                aktualisieren(antwort.data);
                return null;
            }}
        />
    );
}
