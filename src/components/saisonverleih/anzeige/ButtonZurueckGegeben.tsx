import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setSaisonVerleihZurueckgegeben } from "@/lib/saisonverleihactions";
import { startTransition, useActionState, useEffect } from "react";
import { useSaisonverleihanzeigeContext } from "@/context/saisonverleihanzeige-contex";

export default function ButtonZurueckGegeben() {
    const { id, refreshSaisonverleihanzeigePromise } = useSaisonverleihanzeigeContext();
    const [state, action, isPending] = useActionState(setSaisonVerleihZurueckgegeben, false);

    function handleZurueckGegeben() {
        startTransition(() => {
            action(id);
            refreshSaisonverleihanzeigePromise();
        });
    }

    return (
        <div>
            <Button variant="outline" onClick={handleZurueckGegeben} disabled={isPending}>
                <Undo2 />
                Zurück geben
                {isPending && " ..."}
            </Button>
        </div>
    );
}
