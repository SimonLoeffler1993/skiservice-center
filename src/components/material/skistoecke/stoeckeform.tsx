import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkiStoeckeListe from "./stoeckeliste";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod"

import { SkistockCreate, SkistockCreateSchema } from "@/types/materialtypes";
import { skiStoeckeOptions } from "@/hooks/useSchuhMaterialOptions"

import { useForm } from "react-hook-form";
import { startTransition, useActionState, useEffect } from "react";
import { createSkiStoeck } from "@/lib/materialactions";
import { useQueryClient } from "@tanstack/react-query";

export default function SkiStoeckeForm() {
    const { register, reset, handleSubmit, formState: { errors } } = useForm<SkistockCreate>({
        resolver: zodResolver(SkistockCreateSchema),
        defaultValues: {
            Bezeichnung: "",
        }
    });
    const queryClient = useQueryClient();
    const [state, action, isPending] = useActionState(createSkiStoeck, null)

    useEffect(() => {
        if (state?.success) {
            reset();
            queryClient.invalidateQueries({ queryKey: skiStoeckeOptions.queryKey });
        }
    }, [state, reset, queryClient])

    function onSubmit(data: SkistockCreate) {
        console.log("Skistock Data: ", data)
        startTransition(() => {
            action(data)
        })
    }

    return (
        <div>
            <Card className="max-w-sm">
                <CardHeader>
                    <CardTitle>Stock erfassen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label htmlFor="bezeichnung">Bezeichnung</Label>
                            <Input {...register("Bezeichnung")} id="bezeichnung" placeholder="z. B. Elan Hotrod" />
                            {errors.Bezeichnung && (
                                <p className="text-sm text-red-600">{errors.Bezeichnung.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            Stock anlegen
                        </Button>
                    </form>
                    {state?.success === false && (
                        <p className="text-sm text-red-600">{state.error}</p>
                    )}
                </CardContent>
            </Card>
            <SkiStoeckeListe />
        </div>
    )
}