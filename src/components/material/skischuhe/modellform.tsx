"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { schuhHerstellerOptions, schuModelleOptions } from "@/hooks/useSchuhMaterialOptions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SchuhModelleListe from "./modellliste";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { SchuhModellCreate, SchuhModellCreateSchema } from "@/types/materialtypes";
import { startTransition, useActionState, useEffect } from "react";
import { createSchuhModell } from "@/lib/materialactions";

export default function SchuhModellForm() {
    const { data, isLoading, error } = useQuery(schuhHerstellerOptions);
    const queryCleint = useQueryClient();

    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<SchuhModellCreate>({
        resolver: zodResolver(SchuhModellCreateSchema),
        defaultValues: {
            Modell: "",
            Jugend: false,
            Hersteller_ID: undefined,
        }
    });

    const [state, action, isPending] = useActionState(createSchuhModell, null)

    useEffect(() => {
        if (state?.success) {
            reset();
            queryCleint.invalidateQueries({ queryKey: schuModelleOptions.queryKey })
        }
    }, [state, reset, queryCleint])

    if (isLoading) return <p className="text-sm text-muted-foreground">Hersteller werden geladen...</p>;

    if (error) return <p className="text-sm text-destructive">Fehler beim Laden der Hersteller.</p>;

    if (!data) return null;

    function onSubmit(data: SchuhModellCreate) {
        console.log("Schuhmodell Data: ", data)
        startTransition(() => {
            action(data)
        })
    }

    return (
        <div className="p-4">
            <Card className="mx-auto max-w-4xl">
                <CardHeader>
                    <CardTitle>Skischuhmodell erfassen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="hersteller">Hersteller</Label>
                                <Controller
                                    control={control}
                                    name="Hersteller_ID"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ? String(field.value) : undefined}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <SelectTrigger id="hersteller">
                                                <SelectValue placeholder="Hersteller wählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data.map((hersteller) => (
                                                    <SelectItem key={hersteller.ID} value={String(hersteller.ID)}>
                                                        {hersteller.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.Hersteller_ID?.message && (
                                    <p className="text-sm text-red-500">{errors.Hersteller_ID.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="modellname">Modellname</Label>
                                <Input {...register("Modell")} id="modellname" placeholder="z. B. Speed Pro 130" />
                                {errors.Modell?.message && (
                                    <p className="text-sm text-red-500">{errors.Modell.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 md:col-span-2">
                                <Controller
                                    control={control}
                                    name="Jugend"
                                    render={({ field }) => (
                                        <Checkbox
                                            id="jugend"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="jugend" className="font-normal">
                                    Jugendschuh
                                </Label>
                                {errors.Jugend?.message && (
                                    <p className="text-sm text-red-500">{errors.Jugend.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button type="submit" disabled={isPending}>
                                Speichern
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <SchuhModelleListe />
        </div>
    );
}