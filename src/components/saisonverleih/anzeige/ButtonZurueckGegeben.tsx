import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setSaisonVerleihZurueckgegeben } from "@/lib/saisonverleihactions";
import { useActionState, startTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";

interface ButtonZurueckGegebenProps {
    saisonverleihid: number; 
}

export default function ButtonZurueckGegeben({ saisonverleihid }: ButtonZurueckGegebenProps) {
    const queryClient = useQueryClient();
    const [state, action, isPending] = useActionState(setSaisonVerleihZurueckgegeben, false);

    function handleZurueckGegeben() {
        startTransition(async () => {
            action(saisonverleihid);
            await queryClient.invalidateQueries(saisonverleihDetailsOptions(saisonverleihid));
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