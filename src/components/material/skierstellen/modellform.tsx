"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSkiHerstellerContext } from "@/context/skihersteller-context"
import { Suspense, use } from "react"
import SkiModellListe from "./modellliste"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SkiModellCreateSchema, SkiModellCreate } from "@/types/materialtypes"
import { startTransition } from "react"
import { useActionState } from "react"
import { useSkiArtContext } from "@/context/skiart-context"
import { Button } from "@/components/ui/button"
import { createSkiModell } from "@/lib/materialactions"
import { useSkiModellContext } from "@/context/skimodell-context"

export default function SkiModellForm() {
    const { herstellerPromise } = useSkiHerstellerContext();
    const hersteller = use(herstellerPromise);
    const { artPromise } = useSkiArtContext();
    const art = use(artPromise);
    const { refreshModellPromise } = useSkiModellContext();
    const [state, action, isPending] = useActionState(createSkiModell, null);

    const { 
        register,
        reset,
        handleSubmit,
        formState: { errors }
     } = useForm<SkiModellCreate>(
        {
            resolver: zodResolver(SkiModellCreateSchema)
        }
     )

    function onSubmit(data: SkiModellCreate) {
        startTransition(() => {
            action(data)
            refreshModellPromise()
            reset()
        })
    }
    
    // TODO: Fehlerbehandlung
    return (
        <div className="p-4">
            <Card className="mx-auto max-w-4xl">
                <CardHeader>
                    <CardTitle>Skimodell erfassen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium" htmlFor="hersteller">Hersteller</label>
                                <select {...register("Hersteller_ID", { valueAsNumber: true })} id="hersteller" className="h-10 rounded-md border bg-background px-3 text-sm">
                                    {hersteller.map((hersteller) => (
                                        <option key={hersteller.ID} value={hersteller.ID}>{hersteller.Name}</option>
                                    ))}
                                </select>
                                {errors.Hersteller_ID?.message && (
                                    <p className="text-sm text-red-500">{errors.Hersteller_ID.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium" htmlFor="modellname">Modellname</label>
                                <input {...register("Modell")} id="modellname" className="h-10 rounded-md border bg-background px-3 text-sm" />
                                {errors.Modell?.message && (
                                    <p className="text-sm text-red-500">{errors.Modell.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium" htmlFor="kategorie">Ski Art</label>
                                <select {...register("Art_ID", { valueAsNumber: true })} id="kategorie" className="h-10 rounded-md border bg-background px-3 text-sm">
                                    {art.map((art) => (
                                        <option key={art.ID} value={art.ID}>{art.Art}</option>
                                    ))}
                                </select>
                                {errors.Art_ID?.message && (
                                    <p className="text-sm text-red-500">{errors.Art_ID.message}</p>
                                )}
                            </div>
                        </div>
                        <Button disabled={isPending} type="submit">Speichern</Button>
                    </form>
                </CardContent>
            </Card>
            <Suspense fallback={<p>Lade Modelle...</p>}>
                <SkiModellListe />
            </Suspense>
        </div>
    )
}