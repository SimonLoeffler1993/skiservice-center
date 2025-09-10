import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, startTransition, useEffect } from "react";
import { getSkiNrCheck } from "@/lib/materialactions";
import SaisonMaterialSkiAnzeige from "./SaisonMaterialSkiAnzeige";

interface SaisonMaterialSkiProps {
    value: string;
    onChange: (value: string) => void;
    onCheck?: (isValid: boolean) => void;
    error?: string;
}

export default function SaisonMaterialSki({ 
    value, 
    onChange, 
    onCheck,
    error 
}: SaisonMaterialSkiProps) {
    const [state, action, isPending] = useActionState(getSkiNrCheck, null);

    const handleSkiNrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    function handleSkiNrCheck() {
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
            <Label htmlFor="skiNr" className="block text-sm font-medium text-gray-700 mb-1">
                Ski Nr.
            </Label>
            <div className="flex gap-2">
                <Input 
                    type="text" 
                    id="skiNr" 
                    value={value} 
                    onChange={handleSkiNrChange}
                    className={error ? 'border-red-500' : ''}
                />
                <Button 
                    type="button" 
                    onClick={handleSkiNrCheck}
                    disabled={isPending || !value.trim()}
                >
                    {isPending ? 'Prüfe...' : 'Prüfen'}
                </Button>
            </div>
            {error && !isPending && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {isPending && <p className="mt-1 text-sm text-gray-500">Prüfe Ski-Nummer...</p>}
            {state?.success && <SaisonMaterialSkiAnzeige ski={state.data![0]} />}
            {state?.error && !isPending && (
                <p className="mt-1 text-sm text-red-600">{state.error}</p>
            )}
        </div>
    );
}