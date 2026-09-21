"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { startTransition, useActionState, useEffect } from "react"

import { CreateSaisonverleihPreisSchema, CreateSaisonverleihPreis } from "@/types/saisonverleihpreisetypes"
import { createSaisonverleihPreis } from "@/lib/saisonverleihpreisaction"


export default function SaisonverleihPreisForm() {
    const { register, reset, handleSubmit, formState: { errors } } = useForm<CreateSaisonverleihPreis>({
        resolver: zodResolver(CreateSaisonverleihPreisSchema),
        defaultValues: {
            Bezeichnung: "",
            Preis: 0,
            vonL: null,
            bisL: null,
            SkiArt_ID: null,
            inaktiv: false,
        }
    });

    const [state, action, isPending] = useActionState(createSaisonverleihPreis, null)
    const queryClient = useQueryClient();

    useEffect(() => {
        if (state?.success) {
            reset();
            queryClient.invalidateQueries({ queryKey: ["saisonverleihPreise"] });
        }
    }, [state, reset, queryClient])

    function onSubmit(data: CreateSaisonverleihPreis) {
        console.log("Saisonverleih Preis Data: ", data)
        startTransition(() => {
            action(data)
        })
    }

    return (
        <>
        
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
                <Label htmlFor="bezeichnung">Bezeichnung</Label>
                <Input
                    type="text"
                    id="bezeichnung"
                    {...register("Bezeichnung")}
                    placeholder="Bezeichnung eingeben"
                />
                {errors.Bezeichnung && <p className="text-red-500">{errors.Bezeichnung.message}</p>}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="preis">Preis (€)</Label>
                <Input
                    type="number"
                    id="preis"
                    {...register("Preis", { valueAsNumber: true })}
                    placeholder="Preis eingeben"
                />
                {errors.Preis && <p className="text-red-500">{errors.Preis.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="vonL">Von Länge (cm)</Label>
                    <Input
                        type="number"
                        id="vonL"
                        {...register("vonL", { valueAsNumber: true })}
                        placeholder="Von Länge eingeben"
                    />
                    {errors.vonL && <p className="text-red-500">{errors.vonL.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bisL">Bis Länge (cm)</Label>
                    <Input
                        type="number"
                        id="bisL"
                        {...register("bisL", { valueAsNumber: true })}
                        placeholder="Bis Länge eingeben"
                    />
                    {errors.bisL && <p className="text-red-500">{errors.bisL.message}</p>}
                </div>
            </div>

            <Button type="submit" disabled={isPending}>
                Speichern
            </Button>
        </form>
        {state?.success === false && (
            <p className="text-red-500">Fehler beim Speichern des Saisonverleihpreises</p>
        )}
        </>
    )
}