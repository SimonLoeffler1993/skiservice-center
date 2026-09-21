"use client";
import { createSkiservicePreis } from "@/lib/skiservicepreiseactions";
import { CreateSkiservicePreis, CreateSkiservicePreisSchema } from "@/types/skiservicepreisetypes";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";

export default function SkiservicePreisForm() {
    const { register, reset, handleSubmit, formState: { errors } } = useForm<CreateSkiservicePreis>({
        resolver: zodResolver(CreateSkiservicePreisSchema),
        defaultValues: {
            Service: "",
            Preis: 0,
            Bindung: false,
        }
    });
    const [state, action, isPending] = useActionState(createSkiservicePreis, null)
    const queryClient = useQueryClient();

    useEffect(() => {
        if (state?.success) {
            reset();
            queryClient.invalidateQueries({ queryKey: skiservicesPreiseOptions.queryKey });
        }
    }, [state, reset ,queryClient])

    function onSubmit(data: CreateSkiservicePreis) {
        console.log("Skiservice Preis Data: ", data)
        startTransition(() => {
            action(data)
        })
    }

    return (
        <>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <label htmlFor="serviceName" className="text-sm font-medium">
                        Service Name
                    </label>
                    <input
                        type="text"
                        id="serviceName"
                        {...register("Service")}
                        className="rounded-lg border p-2 text-sm"
                        placeholder="Enter service name"
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="price" className="text-sm font-medium">
                        Price (€)
                    </label>
                    <input
                        type="number"
                        id="price"
                        {...register("Preis", { valueAsNumber: true })}
                        className="rounded-lg border p-2 text-sm"
                        placeholder="Enter price"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    disabled={isPending}
                >
                    Service Preis erstellen
                </button>
            </form>
            {state?.success === false && (
                <p className="text-sm text-red-600">{state.error}</p>
            )}
        </>
    )
}