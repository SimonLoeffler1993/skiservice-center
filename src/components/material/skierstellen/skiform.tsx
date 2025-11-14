"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { use } from "react"

import { useSkiModellContext } from "@/context/skimodell-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition } from "react"
import { useActionState } from "react"
import { createSki } from "@/lib/materialactions"

import { SkiCreateSchema, SkiCreate } from "@/types/materialtypes"

export default function SkiForm() {
    const { modellPromise } = useSkiModellContext();
    const modell = use(modellPromise);
    const { 
        register,
        reset,
        handleSubmit,
        formState: { errors }
     } = useForm<SkiCreate>(
        {
            resolver: zodResolver(SkiCreateSchema)
        }
     )

    const [state, action, isPending] = useActionState(createSki, null);
    function onSubmit(data: SkiCreate) {
        startTransition(() => {
            action(data)
            reset()
        })
    }
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card className="m-2">
                <CardHeader>
                    <CardTitle>Ski erfassen</CardTitle>
                </CardHeader>
                <CardContent>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="modell">Skimodell</Label>
                                <select id="modell" className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...register("Modell_ID", { valueAsNumber: true })}>
                                    <option value="">Skimodell wählen</option>
                                    {modell.map((m) => (
                                        <option key={m.ID} value={m.ID}>{m.Hersteller.Name} {m.Modell}</option>
                                    ))}
                                </select>
                                {errors.Modell_ID?.message && (
                                    <p className="text-sm text-red-500">{errors.Modell_ID.message}</p>
                                )}
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="skinr">Ski Nr</Label>
                                <Input {...register("SkiNr")} id="skinr" type="text" placeholder="z.B. SKI-2025-0001" />
                                {errors.SkiNr?.message && (
                                    <p className="text-sm text-red-500">{errors.SkiNr.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="laenge">Länge (cm)</Label>
                                <Input {...register("Laenge", { valueAsNumber: true })} id="laenge" type="number" placeholder="z.B. 170" />
                                {errors.Laenge?.message && (
                                    <p className="text-sm text-red-500">{errors.Laenge.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="saison">Saison</Label>
                                <Input {...register("Saison")} id="saison" type="text" placeholder="z.B. 25/26" />
                                {errors.Saison?.message && (
                                    <p className="text-sm text-red-500">{errors.Saison.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ekpreis">EK Netto Preis</Label>
                                <Input {...register("EK", { valueAsNumber: true })} id="ekpreis" type="number" step="0.01" placeholder="z.B. 520.00" />
                                {errors.EK?.message && (
                                    <p className="text-sm text-red-500">{errors.EK.message}</p>
                                )}
                            </div>   

                            <div className="space-y-2">
                                <Label htmlFor="vkpreis">VK Preis</Label>
                                <Input {...register("VK", { valueAsNumber: true })} id="vkpreis" type="number" step="0.01" placeholder="z.B. 799.99" />
                                {errors.VK?.message && (
                                    <p className="text-sm text-red-500">{errors.VK.message}</p>
                                )}
                            </div>                         
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => reset()} disabled={isPending}>Abbrechen</Button>
                            <Button type="submit" disabled={isPending}>Speichern</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}