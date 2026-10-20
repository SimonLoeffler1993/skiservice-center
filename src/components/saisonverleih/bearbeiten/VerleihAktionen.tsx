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
};

export function istVerleihBezahlt(verleih: SaisonverleihRead) {
    return verleih.Bezahlt === 1 || verleih.QuittungID != null;
}

export default function VerleihAktionen({ verleih }: VerleihAktionenProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const bezahlt = istVerleihBezahlt(verleih);

    return (
        <div className="flex flex-wrap items-center gap-2">
            <VerleihBearbeitenDialog verleih={verleih} bezahlt={bezahlt} />
            <MaterialHinzufuegenDialog verleih={verleih} bezahlt={bezahlt} />
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
    );
}
