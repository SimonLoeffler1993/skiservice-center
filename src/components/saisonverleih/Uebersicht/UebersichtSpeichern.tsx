import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import { Button } from "../../ui/button";
import { useActionState, startTransition } from "react";
import { createSaisonVerleih } from "@/lib/saisonverleihactions";

type UebersichtSpeichernProps = {
    datenChecked: boolean;  
}

export default function UebersichtSpeichern({datenChecked}: UebersichtSpeichernProps) {
    const {datenVollstaendig, kunde, bemerkung, materialList} = useSaisonverleihContext();
   
    const [state, action, isPending] = useActionState(createSaisonVerleih, null);

    function handleSpeichern() {
        if (kunde?.ID === undefined) {
            console.error("Kunde ID ist nicht definiert");
            return;
        }
        startTransition(() => action({
            Kunde_ID: kunde.ID,
            Bemerkung: bemerkung,
            Material: materialList
        }))
    }

    if (isPending) {
        return <p>Saisonverleih wird gespeichert...</p>;
    }

    return (
        <>
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full" disabled={!(datenVollstaendig && datenChecked)} onClick={handleSpeichern}>
                Speichern
            </Button>
            {state == null && <p>Es gab ein Fehler</p>}
        </>
    );
}