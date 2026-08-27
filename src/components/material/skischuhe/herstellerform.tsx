"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { HerstellerCreate, HerstellerCreateSchema } from "@/types/materialtypes"
import { createSkiHersteller } from "@/lib/materialactions"
import { useActionState, useEffect, startTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { schuhHerstellerOptions } from "@/hooks/useSchuhMaterialOptions"
import SchuhHerstellerListe from "./herstellerliste"

export default function SchuhHerstellerForm() {
    const [state, action, isPending] = useActionState(createSkiHersteller, null);
    const queryClient = useQueryClient();

    const { register, reset, handleSubmit, formState: { errors } } = useForm<HerstellerCreate>({
        resolver: zodResolver(HerstellerCreateSchema)
    });

    useEffect(() => {
        if (state?.success) {
            reset();
            queryClient.invalidateQueries({ queryKey: schuhHerstellerOptions.queryKey });
        }
    }, [state, reset, queryClient]);

    function onSubmit(data: HerstellerCreate) {
        startTransition(() => {
            action({ name: data.Name, schuh: true });
        });
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="m-2">
                <CardHeader>
                    <CardTitle>Neuen Schuh-Hersteller anlegen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <Input
                                id="name"
                                placeholder="z.B. Salomon, Atomic, Fischer"
                                {...register("Name")}
                                className={errors.Name ? "ring-1 ring-red-500" : ""}
                            />
                            <p className="text-xs text-muted-foreground">Bitte den vollständigen Herstellernamen eingeben.</p>
                            {errors.Name?.message && (
                                <p className="text-sm text-red-500">{errors.Name.message}</p>
                            )}
                        </div>

                        {state && !state.success && (
                            <p className="text-sm text-red-500">{state.error}</p>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button type="submit" disabled={isPending}>
                                Speichern
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <SchuhHerstellerListe />
        </div>
    );
}