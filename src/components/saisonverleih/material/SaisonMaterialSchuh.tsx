import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, startTransition, useEffect } from "react";
import { getSchuhNrCheck } from "@/lib/materialactions";
import SaisonMaterialSchuhAnzeige from "./SaisonMaterialSchuhAnzeigen";

interface SaisonMaterialSchuhProps {
    value: string;
    onChange: (value: string) => void;
    onCheck?: (isValid: boolean) => void;
    error?: string;
}

export default function SaisonMaterialSchuh({ 
    value, 
    onChange, 
    onCheck,
    error 
}: SaisonMaterialSchuhProps) {
    const [state, action, isPending] = useActionState(getSchuhNrCheck, null);
    
    const handleSchuhNrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    function handleSchuhNrCheck() {
        startTransition(() => action(value));
    }

    // Notify parent about check result
    useEffect(() => {
        if (state) {
            onCheck?.(state.success);
        }
    }, [state, onCheck]);
    
    return (
        <div>
            <Label htmlFor="interneSchuhNummer" className="block text-sm font-medium text-gray-700 mb-1">
                Schuh Nr.
            </Label>
            <div className="flex gap-2">
                <Input 
                    type="text" 
                    id="interneSchuhNummer" 
                    value={value} 
                    onChange={handleSchuhNrChange}
                    className={error ? 'border-red-500' : ''}
                />
                <Button 
                    type="button" 
                    onClick={handleSchuhNrCheck}
                    disabled={isPending || !value.trim()}
                >
                    {isPending ? 'Prüfe...' : 'Prüfen'}
                </Button>
            </div>
            {error && !isPending && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {isPending && <p className="mt-1 text-sm text-gray-500">Prüfe Schuh-Nummer...</p>}
            {state?.success && <SaisonMaterialSchuhAnzeige schuh={state.data!} />}
            {state?.error && !isPending && (
                <p className="mt-1 text-sm text-red-600">{state.error}</p>
            )}
        </div>
    );
}