"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { loescheVerleih } from "@/lib/bearbeitenactions";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import MaterialHinzufuegenDialog from "./MaterialHinzufuegenDialog";
import VerleihBearbeitenDialog from "./VerleihBearbeitenDialog";

type VerleihAktionenProps = {
    verleih: SaisonverleihRead;
    // Weitere Aktionen vor "Löschen", z.B. PDF und Etiketten
    children?: React.ReactNode;
};

export function istVerleihBezahlt(verleih: SaisonverleihRead) {
    return verleih.Bezahlt === 1 || verleih.QuittungID != null;
}

// Buttons für die Aktionsleiste der Detailansicht, "Löschen" ganz rechts
export default function VerleihAktionen({ verleih, children }: VerleihAktionenProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const bezahlt = istVerleihBezahlt(verleih);

    return (
        <>
            <VerleihBearbeitenDialog verleih={verleih} bezahlt={bezahlt} />
            <MaterialHinzufuegenDialog verleih={verleih} bezahlt={bezahlt} />
            {children}
            <div className="sm:ml-auto">
                <LoeschenDialog
                    titel={`${verleih.Name} löschen`}
                    beschreibung="Der Verleih und alles zugehörige Material werden endgültig gelöscht."
                    buttonText="Löschen"
                    deaktiviert={bezahlt}
                    deaktiviertGrund="Bezahlte Verleihe können nicht gelöscht werden"
                    onLoeschen={async () => {
                        const antwort = await loescheVerleih(verleih.ID);
                        if (!antwort.success) return antwort.error;
                        queryClient.invalidateQueries({ queryKey: ["saisonverleihList"] });
                        router.push("/saisonverleih/anzeigen");
                        return null;
                    }}
                />
            </div>
        </>
    );
}
