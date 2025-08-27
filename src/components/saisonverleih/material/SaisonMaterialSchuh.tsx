import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useActionState, startTransition } from "react";
import { getSchuhNrCheck } from "@/lib/materialactions";
import SaisonMaterialSchuhAnzeige from "./SaisonMaterialSchuhAnzeigen";

export default function SaisonMaterialSchuh() {
    const [schuhNr, setSchuhNr] = useState("");
    const [state, action, isPending] = useActionState(getSchuhNrCheck, null);
    
    const handleSchuhNrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchuhNr(e.target.value);
    };

    function handleSchuhNrCheck() {
        startTransition(() => action(schuhNr));
    }
    
    return (
        <>
        <Label htmlFor="Schuh" className="block text-sm font-medium text-gray-700 mb-1">Schuh</Label>
        <Input type="text" id="Schuh" value={schuhNr} onChange={handleSchuhNrChange} />
        <Button type="button" className="mt-2" onClick={handleSchuhNrCheck}>Schuh Prüfen</Button>
        {isPending && <p>Lädt...</p>}
        {state?.success && <SaisonMaterialSchuhAnzeige  schuh={state.data!}/>}
        {state?.error && <p>{state.error}</p>}
        </>
    )
}