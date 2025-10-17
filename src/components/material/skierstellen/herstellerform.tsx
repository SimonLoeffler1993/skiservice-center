"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import { HerstellerCreateSchema, HerstellerCreate } from "@/types/materialtypes"
import Herstellerliste from "./herstellerliste"
import { createSkiHersteller } from "@/lib/materialactions"
import { useSkiHerstellerContext } from "@/context/skihersteller-context"
import { startTransition } from "react"
import { useActionState } from "react"
import { Suspense } from "react"

export default function SkiHerstellerForm() {
    const { refreshHerstellerPromise } = useSkiHerstellerContext()
    const [state, action, isPending] = useActionState(createSkiHersteller, null);
    const { 
        register,
        reset,
        handleSubmit,
        formState: { errors }
     } = useForm<HerstellerCreate>(
        {
            resolver: zodResolver(HerstellerCreateSchema)
        }
     )

    function onSubmit(data: HerstellerCreate) {
        // console.log(data)
        startTransition(() => {
            action(data.Name)
            refreshHerstellerPromise()
            reset()
        })
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="m-2">
                <CardHeader>
                    <CardTitle>Neuen Ski-Hersteller anlegen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <Input
                                id="name"
                                aria-invalid={!!errors.Name}
                                {...register("Name")}
                                placeholder="z.B. Elan, Atomic, Salomon"
                                className={errors.Name ? "ring-1 ring-red-500" : ""}
                            />
                            <p className="text-xs text-muted-foreground">Bitte den vollständigen Herstellernamen eingeben.</p>
                            {errors.Name?.message && (
                                <p className="text-sm text-red-500">{errors.Name.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button disabled={isPending} type="submit">
                                {isPending ? "Speichern…" : "Speichern"}
                            </Button>
                        </div>
                    </form>
                    
                </CardContent>
            </Card>

            <Suspense fallback={<p>Loading…</p>}>
                <Herstellerliste />
            </Suspense>                
        </div>
    );
}