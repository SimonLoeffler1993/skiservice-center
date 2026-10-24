"use client";

import { useActionState, startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { skiSuchKundeSchema, SkiSuchKunde, Kunde } from "@/types/skikundentypes";
import { kundeSuchen } from "@/lib/kundeactions";
import KundeSuchErgebnisseTabelle from "./KundeSuchErgebnisseTabelle";
import KundeForm from "@/components/kunde/KundeForm";

type KundeSuchFormProps = {
    onKundeSelected?: (kunde: Kunde) => void;
};

export default function KundeSuchForm({ onKundeSelected }: KundeSuchFormProps = {}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SkiSuchKunde>({
        resolver: zodResolver(skiSuchKundeSchema),
    });

    const [state, action, isPending] = useActionState(kundeSuchen, null);
    const [ausgewaehlterKunde, setAusgewaehlterKunde] = useState<Kunde | null>(null);

    // Ergebnis direkt aus der Server Action (dort bereits mit kundenArraySchema geprüft)
    const suchErgebnis = state?.success ? state.data : null;
    const suchFehler = state && !state.success ? ("error" in state && typeof state.error === "string" ? state.error : "Fehler beim Suchen") : null;

    function onSubmit(data: SkiSuchKunde) {
        startTransition(() => action(data));
    }

    function onKundeAuswaehlen(kunde: Kunde) {
        setAusgewaehlterKunde(kunde);
        onKundeSelected?.(kunde);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                {/* Handy untereinander, ab Tablet nebeneinander mit dem Button unten bündig */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                    <div className="space-y-1.5">
                        <Label htmlFor="vorname">Vorname</Label>
                        <Input id="vorname" className="h-10" autoComplete="off" {...register("Vorname")} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="nachname">Nachname</Label>
                        <Input id="nachname" className="h-10" autoComplete="off" autoFocus {...register("Nachname")} />
                    </div>
                    <Button type="submit" className="h-10 w-full sm:w-auto" disabled={isPending}>
                        {isPending ? "Suche…" : "Suchen"}
                    </Button>
                </div>
                {errors.Vorname && <p className="text-sm text-destructive">{errors.Vorname.message}</p>}
                {suchFehler && <p className="text-sm text-destructive">{suchFehler}</p>}
            </form>
            {/* Ergebnisse erst nach einer Suche */}
            {!isPending && state?.success && <KundeSuchErgebnisseTabelle daten={suchErgebnis} onKundeAuswaehlen={onKundeAuswaehlen} />}
            {ausgewaehlterKunde && <KundeForm kunde={ausgewaehlterKunde} />}
        </div>
    );
}
