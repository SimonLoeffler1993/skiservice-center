"use client";

import { saisonverleihPreiseOptions } from "@/hooks/useSaisonverleihPreiseOptions";
import { useQuery } from "@tanstack/react-query";

export default function SaisonverleihPreiseliste() {
    const { data, isLoading, error } = useQuery(saisonverleihPreiseOptions);

    if (isLoading) return <p>Preise werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Preise: {error.message}</p>

    if (!data?.success) return <p>Preise konnten nicht geladen werden</p>

    console.log("SaisonverleihPreiseliste data:", data);
    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Saisonverleih Preise</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.data.preise.map((preis) => (
                    <div key={preis.ID} className="rounded-lg border p-4">
                        <h3 className="text-md font-semibold">{preis.Bezeichnung}</h3>
                        <p className="text-sm text-muted-foreground">€{preis.Preis}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
