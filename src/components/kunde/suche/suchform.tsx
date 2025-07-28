"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { skiSuchKundeSchema, SkiSuchKunde, kundenArraySchema, Kunde } from "@/types/skikundentypes";

// import { useActionState } from "react";
import { kundeSuchen } from "@/lib/kundeactions";
import { useActionState, startTransition, useState, useEffect } from "react";
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
    const [suchErgebnis, setSuchErgebnis] = useState<Kunde[] | null>(null);
    const [ausgewaehlterKunde, setAusgewaehlterKunde] = useState<Kunde | null>(null);

    // const  {state, action, isPending} = useActionState(kundeSuchen, null);

    useEffect(() => {
        if (state?.success) {
            const parsedData = kundenArraySchema.safeParse(state.data);
            if (parsedData.success) {
                setSuchErgebnis(parsedData.data);
            }
            
        }
    }, [state]);

    function onSubmit(data: SkiSuchKunde) {
        console.log("Suchanfrage:", data);
        // TODO Serveraction zum Suchen von Kunden aufrufen
        startTransition(() => action(data)); //action(data);
        console.log("Suchanfrage gesendet");
        console.log(state)
        // if (state?.success) {
        //     const parsedData = kundenArraySchema.safeParse(state.data);
        //     if (!parsedData.success) {
        //         console.error("Validierungsfehler:", parsedData.error);
        //         return;
        //     }
        //     setSuchErgebnis(parsedData.data);
        // }
    }
    
    function onKundeAuswaehlen(kunde: Kunde) {
        setAusgewaehlterKunde(kunde);
        onKundeSelected?.(kunde);
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-cols-2 gap-4">
                    <Label htmlFor="vorname">Vorname</Label>
                    <Input id="vorname" {...register("Vorname")} />
                    
                    
                    <Label htmlFor="nachname">Nachname</Label>
                    <Input id="nachname" {...register("Nachname")} />
                    
                    <Button type="submit" >Suchen</Button>
                </div>
                {errors.Vorname && <span className="text-red-500">{errors.Vorname.message}</span>}
                {isPending && <span className="text-muted-foreground">Suche läuft...</span>}
            </form>
            {!isPending && <KundeSuchErgebnisseTabelle daten={suchErgebnis} onKundeAuswaehlen={onKundeAuswaehlen} />}
            {ausgewaehlterKunde && <KundeForm kunde={ausgewaehlterKunde} />}
        </div>
    );
}