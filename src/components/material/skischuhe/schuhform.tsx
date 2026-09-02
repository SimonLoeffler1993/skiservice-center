import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SkischuheListe from "./schuheliste";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { schuModelleOptions, skiSchuheOptions } from "@/hooks/useSchuhMaterialOptions";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSchuhSchema, CreateSkiSchuh } from "@/types/materialtypes";
import { createSkiSchuh } from "@/lib/materialactions";
import { startTransition, useActionState, useEffect } from "react";

export default function SkischuhForm() {
    const { data, isLoading, error } = useQuery(schuModelleOptions);
    const queryClient = useQueryClient();

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateSkiSchuh>({
        resolver: zodResolver(CreateSchuhSchema),
    });

    const [state, action, isPending] = useActionState(createSkiSchuh, null);

    useEffect(() => {
        if (state?.success) {
            queryClient.invalidateQueries({ queryKey: skiSchuheOptions.queryKey });
        }
    }, [state, reset, queryClient]);

    function onSubmit(data: CreateSkiSchuh) {
        console.log(data);
        startTransition(() => {
            action(data);
        });
    }

    if (isLoading) return <p>Schuhmodelle werden geladen...</p>;

    if (error) return <p className="text-red-500">Fehler beim Laden der Schuhmodelle.</p>;

    if (!data?.success) return <p>Schuhmodelle konnten nicht geladen werden</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card className="m-2 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-muted-foreground" />
                        Skischuh erfassen
                    </CardTitle>
                    <CardDescription>
                        Neuen Skischuh mit Modell, Größe und Preisen hinzufügen
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="modell">Schuhmodell</Label>
                                <Controller
                                    control={control}
                                    name="Modell_ID"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ? String(field.value) : undefined}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <SelectTrigger id="modell" className="w-full">
                                                <SelectValue placeholder="Modell wählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data.data.map((modell) => (
                                                    <SelectItem key={modell.ID} value={String(modell.ID)}>
                                                        {modell.Hersteller.Name} {modell.Modell} {modell.Jugend && " Jugend"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.Modell_ID && (
                                    <p className="text-sm text-red-500">{errors.Modell_ID.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="saison">Saison</Label>
                                <Input id="saison" type="text" placeholder="25/26" {...register("Saison")} />
                                {errors.Saison && (
                                    <p className="text-sm text-red-500">{errors.Saison.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="groesse">Größe</Label>
                                <div className="relative">
                                    <Input
                                        id="groesse"
                                        type="number"
                                        placeholder="27.5"
                                        step="0.5"
                                        className="pr-12"
                                        {...register("Groese", { valueAsNumber: true })}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        MP
                                    </span>
                                </div>
                                {errors.Groese && (
                                    <p className="text-sm text-red-500">{errors.Groese.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ek">EK</Label>
                                <div className="relative">
                                    <Input
                                        id="ek"
                                        type="number"
                                        placeholder="150"
                                        className="pr-8"
                                        {...register("EK", { valueAsNumber: true })}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        €
                                    </span>
                                </div>
                                {errors.EK && (
                                    <p className="text-sm text-red-500">{errors.EK.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vk">VK</Label>
                                <div className="relative">
                                    <Input
                                        id="vk"
                                        type="number"
                                        placeholder="299"
                                        className="pr-8"
                                        {...register("VK", { valueAsNumber: true })}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        €
                                    </span>
                                </div>
                                {errors.VK && (
                                    <p className="text-sm text-red-500">{errors.VK.message}</p>
                                )}
                            </div>
                        </div>

                        <Button type="submit" disabled={isPending}>Skischuh speichern</Button>
                    </form>
                </CardContent>
            </Card>
            <SkischuheListe />
        </div>
    )
}