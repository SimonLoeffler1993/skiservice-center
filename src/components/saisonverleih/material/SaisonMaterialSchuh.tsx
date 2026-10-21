import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useTransition } from "react";
import { getSchuhNrCheck } from "@/lib/materialactions";
import SaisonMaterialSchuhAnzeige from "./SaisonMaterialSchuhAnzeigen";
import { Loader2, Search } from "lucide-react";
import { useBelegungPruefung } from "@/hooks/useBelegungPruefung";
import BelegungHinweis from "./BelegungHinweis";

interface SaisonMaterialSchuhProps {
    // Eingegebene Schuh-Nr. (z.B. "17" oder "INV-0042")
    value: string;
    onChange: (value: string) => void;
    onCheck?: (isValid: boolean) => void;
    // Interne ID des gefundenen Schuhs, wird im Verleih gespeichert
    onGefunden?: (schuhId: number | undefined) => void;
    error?: string;
}

export default function SaisonMaterialSchuh({
    value,
    onChange,
    onCheck,
    onGefunden,
    error
}: SaisonMaterialSchuhProps) {
    // Ergebnis der Prüfung, gilt nur für die geprüfte Nummer
    const [pruefung, setPruefung] = useState<{ nummer: string; ergebnis: Awaited<ReturnType<typeof getSchuhNrCheck>> } | null>(null);
    const [isPending, startTransition] = useTransition();
    const state = pruefung?.nummer === value ? pruefung.ergebnis : null;
    // Beim Tagesverleih zusätzlich prüfen, ob im Zeitraum frei (über die interne ID)
    const belegung = useBelegungPruefung("schuh");
    const belegungsErgebnis = state?.success ? belegung.aktuellesErgebnis(String(state.data.ID)) : null;
    const belegt = !!belegungsErgebnis && (belegungsErgebnis.belegungen.length > 0 || !!belegungsErgebnis.fehler);

    const handleSchuhNrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Neue Nummer muss erneut geprüft werden
        onChange(e.target.value);
        onGefunden?.(undefined);
    };

    function handleSchuhNrCheck() {
        const nummer = value;
        startTransition(async () => {
            const ergebnis = await getSchuhNrCheck(null, nummer);
            setPruefung({ nummer, ergebnis });
            onGefunden?.(ergebnis.success ? ergebnis.data.ID : undefined);
            if (ergebnis.success) belegung.pruefen(String(ergebnis.data.ID));
        });
    }

    // Notify parent about check result
    useEffect(() => {
        if (state) {
            onCheck?.(state.success && !belegt);
        }
    }, [state, belegt, onCheck]);

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
                    className={`min-w-0 ${error ? 'border-red-500' : ''}`}
                />
                <Button
                    type="button"
                    size="icon"
                    className="shrink-0"
                    onClick={handleSchuhNrCheck}
                    disabled={isPending || !value.trim()}
                    aria-label="Schuh-Nummer prüfen"
                    title="Schuh-Nummer prüfen"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <Search />}
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
            {belegung.aktiv && state?.success && (
                <BelegungHinweis
                    belegungen={belegungsErgebnis?.belegungen ?? null}
                    fehler={belegungsErgebnis?.fehler ?? null}
                    isPending={belegung.isPending}
                />
            )}
        </div>
    );
}