"use client";

import { aendereSki } from "@/lib/bearbeitenactions";
import { Ski } from "@/types/skiservicetypes";
import { useAuftragAktualisieren } from "../bearbeiten/useAuftragAktualisieren";
import BindungsdatenBearbeitenDialog from "./BindungsdatenBearbeitenDialog";

type BindungsdatenDialogProps = {
    ski: Ski;
    kundeId: number;
};

// Bindungsdaten eines Ski nachträglich erfassen oder ändern, auch bei bezahlten Aufträgen
export default function BindungsdatenDialog({ ski, kundeId }: BindungsdatenDialogProps) {
    const aktualisieren = useAuftragAktualisieren(ski.auftrag_id);

    return (
        <BindungsdatenBearbeitenDialog
            titel={ski.name ?? ""}
            idPrefix={`dialog-${ski.id}`}
            bindungsdaten={ski.bindungsdaten}
            kundeId={kundeId}
            onSpeichern={async (daten, vorlageId) => {
                const antwort = await aendereSki(ski.auftrag_id, ski.id, { bindungsdaten: daten, vorlage_id: vorlageId });
                if (!antwort.success) return antwort.error;
                aktualisieren(antwort.data);
                return null;
            }}
        />
    );
}
