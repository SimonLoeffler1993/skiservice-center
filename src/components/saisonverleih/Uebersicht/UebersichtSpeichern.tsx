import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import { Button } from "../../ui/button";
import { useActionState, startTransition, useEffect } from "react";
import { createSaisonVerleih } from "@/lib/saisonverleihactions";
import UebersichtGespeichert from "./UeberSichtGespeichert";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";


type UebersichtSpeichernProps = {
    datenChecked: boolean;  
}

export default function UebersichtSpeichern({datenChecked}: UebersichtSpeichernProps) {
    const {datenVollstaendig, kunde, bemerkung, materialList, art, zeitraum} = useSaisonverleihContext();
   
    const [state, action, isPending] = useActionState(createSaisonVerleih, null);
    const queryClient = useQueryClient();

    // Liste neu laden, damit der neue Verleih sofort erscheint
    useEffect(() => {
        if (state?.success) {
            queryClient.invalidateQueries({ queryKey: ["saisonverleihList"] });
        }
    }, [state, queryClient]);

    function handleSpeichern() {
        if (kunde?.ID === undefined) {
            console.error("Kunde ID ist nicht definiert");
            return;
        }
        // Datum lokal formatieren, toISOString würde in UTC umrechnen und den Tag verschieben
        const tagesverleih = art === "tag" && zeitraum?.from && zeitraum?.to
            ? { Start_Am: format(zeitraum.from, "yyyy-MM-dd"), Ende_Am: format(zeitraum.to, "yyyy-MM-dd") }
            : {};
        startTransition(() => action({
            Kunde_ID: kunde.ID,
            Bemerkung: bemerkung,
            Material: materialList,
            Art: art,
            ...tagesverleih,
        }))
    }

    if (isPending) {
        return <p>Saisonverleih wird gespeichert...</p>;
    }

    if (state?.success) {
        if (state.data) {
            return <UebersichtGespeichert id={state.data.ID} />;
        }
    }

    return (
        <>
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full" disabled={!(datenVollstaendig && datenChecked)} onClick={handleSpeichern}>
                Speichern
            </Button>
            {state?.success === false && <p className="text-sm text-destructive">{state.error ?? "Saisonverleih konnte nicht gespeichert werden."}</p>}
        </>
    );
}