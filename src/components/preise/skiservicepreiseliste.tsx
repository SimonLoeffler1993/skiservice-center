"use client";

import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { useQuery } from "@tanstack/react-query";

export default function SkiservicePreiseListe() {
    const { data, isLoading, error } = useQuery(skiservicesPreiseOptions);

    if (isLoading) return <p>Service Preise werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Service Preise: {error.message}</p>

    if (!data?.success) return <p>Service Preise konnten nicht geladen werden</p>

    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Skiservice Preise</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.data.map((service) => (
                    <div key={service.id} className="rounded-lg border p-4">
                        <h3 className="text-md font-semibold">{service.Service}</h3>
                        <p className="text-sm text-muted-foreground">€{service.Preis}</p>
                    </div>
                ))}              
            </div>
        </div>
    )
}