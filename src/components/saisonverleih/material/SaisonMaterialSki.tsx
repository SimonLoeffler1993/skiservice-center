import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useActionState, startTransition } from "react";
import { getSkiNrCheck } from "@/lib/materialactions";
import SaisonMaterialSkiAnzeige from "./SaisonMaterialSkiAnzeige";

export default function SaisonMaterialSki() {
    const [skinr, setSkiNr] = useState("");
    
    const handleSkiNrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkiNr(e.target.value);
    };

    const [state, action, isPending] = useActionState(getSkiNrCheck, null);

    // TODO: Ski Automatisch beim Tippen prüfen

    function handleSkiNrCheck() {
        startTransition(() => action(skinr));
        console.log(state);
    }
    
    return (
        <>
           <Label htmlFor="Ski" className="block text-sm font-medium text-gray-700 mb-1">Ski</Label>
           <Input type="text" id="Ski" value={skinr} onChange={handleSkiNrChange} />
           <Button type="button" className="mt-2" onClick={handleSkiNrCheck}>Ski Prüfen</Button>
           {isPending && <p>Lädt...</p>}
           {state?.success && <SaisonMaterialSkiAnzeige  ski={state.data![0]}/>}
           {state?.error && <p>{state.error}</p>}
        </>
    )

}