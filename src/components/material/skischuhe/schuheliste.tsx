"use client"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { schuModelleOptions, skiSchuheOptions } from "@/hooks/useSchuhMaterialOptions"
import SkischuhCard from "./schuhcard"
import { AusgemusterteFilter } from "../bearbeiten/MaterialAktionen"

export default function SkischuheListe() {
    const {data, isLoading, error} = useQuery(skiSchuheOptions)
    const { data: modelle } = useQuery(schuModelleOptions)
    const queryClient = useQueryClient()
    const [mitAusgemustert, setMitAusgemustert] = useState(false)

    if (isLoading) return <p>Skischuhe werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Skischuhe.</p>

    if (!data?.success) return <p>Skischuhe konnten nicht geladen werden</p>

    const anzahlAusgemustert = data.data.filter((schuh) => schuh.Ausgemustert).length
    const schuhe = mitAusgemustert ? data.data : data.data.filter((schuh) => !schuh.Ausgemustert)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Skischuhe Liste</h1>
                <AusgemusterteFilter wert={mitAusgemustert} onChange={setMitAusgemustert} anzahl={anzahlAusgemustert} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {schuhe.map((schuh) => (
                    <SkischuhCard
                        key={schuh.ID}
                        schuh={schuh}
                        modelle={modelle?.success ? modelle.data : []}
                        onGeaendert={() => queryClient.invalidateQueries({ queryKey: skiSchuheOptions.queryKey })}
                    />
                ))}
            </div>
        </div>
    )
}
