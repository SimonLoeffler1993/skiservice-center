"use client";

import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { startTransition, useActionState, useEffect } from "react";
import { setzeBindungsserviceAction } from "@/lib/skiservicepreiseactions";

type FormValues = {
    service: string;
};

export default function BindungsserviceFestlegen() {
    const { data, isLoading, error } = useQuery(skiservicesPreiseOptions);
    const [state, action, isPending] = useActionState(setzeBindungsserviceAction, null);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FormValues>();

    // Default-Wert setzen, sobald die Daten geladen sind
    useEffect(() => {
        if (data?.success) {
            const aktuellerBindungsService = data.data.find((service) => service.Bindung);
            if (aktuellerBindungsService) {
                reset({ service: String(aktuellerBindungsService.id) });
            }
        }
    }, [data, reset]);

    // Cache invalidieren, sobald das Setzen erfolgreich war
    useEffect(() => {
        if (state?.success) {
            queryClient.invalidateQueries({ queryKey: skiservicesPreiseOptions.queryKey });
        }
    }, [state, queryClient]);

    const onSubmit = (values: FormValues) => {
        startTransition(() => {
            action(Number(values.service));
        });
    };

    if (isLoading) return <p>Service Preise werden geladen...</p>;

    if (error) return <p className="text-red-500">Fehler beim Laden der Service Preise: {error.message}</p>;

    if (!data?.success) return <p>Service Preise konnten nicht geladen werden</p>;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Bindungsservice festlegen</h1>
            {state?.success && <p className="text-green-500">Bindungsservice erfolgreich festgelegt!</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <label htmlFor="service">Service</label>
                <select id="service" className="border rounded p-2" {...register("service")}>
                    {data.data.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.Service} - €{service.Preis}
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={isPending} className="bg-blue-500 text-white rounded p-2 disabled:opacity-50">
                    Service festlegen
                </button>
                {state?.success === false && (
                    <p className="text-red-500">Fehler beim Festlegen des Bindungsservices: {state.error}</p>
                )}
            </form>
        </div>
    );
}