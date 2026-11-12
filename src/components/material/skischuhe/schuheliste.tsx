"use client"
import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { schuModelleOptions, skiSchuheOptions } from "@/hooks/useSchuhMaterialOptions"
import SkischuhCard from "./schuhcard"
import { AusgemusterteFilter } from "../bearbeiten/MaterialAktionen"
import MaterialFilter, { eindeutigeOptionen, LEERER_FILTER, passtAllgemein } from "../MaterialFilter"

const JUGEND_OPTIONEN = [
    { wert: "erwachsen", text: "Erwachsen" },
    { wert: "jugend", text: "Jugend" },
]

export default function SkischuheListe() {
    const {data, isLoading, error} = useQuery(skiSchuheOptions)
    const { data: modelle } = useQuery(schuModelleOptions)
    const queryClient = useQueryClient()
    const [mitAusgemustert, setMitAusgemustert] = useState(false)
    const [filter, setFilter] = useState(LEERER_FILTER)

    const alle = useMemo(() => (data?.success ? data.data : []), [data])

    // Nur Werte anbieten, die in der Liste vorkommen
    const optionen = useMemo(() => {
        const hersteller = eindeutigeOptionen(alle.map((s) => ({ wert: String(s.Modell.Hersteller.ID), text: s.Modell.Hersteller.Name })))
        const modellOptionen = eindeutigeOptionen(
            alle
                .filter((s) => !filter.hersteller || String(s.Modell.Hersteller.ID) === filter.hersteller)
                .map((s) => ({ wert: String(s.Modell_ID), text: `${s.Modell.Modell}${s.Modell.Jugend ? " (Jugend)" : ""}` })),
        )
        const saisons = eindeutigeOptionen(alle.map((s) => ({ wert: s.Saison, text: s.Saison })))
        return { hersteller, modelle: modellOptionen, saisons }
    }, [alle, filter.hersteller])

    if (isLoading) return <p>Skischuhe werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Skischuhe.</p>

    if (!data?.success) return <p>Skischuhe konnten nicht geladen werden</p>

    const anzahlAusgemustert = alle.filter((schuh) => schuh.Ausgemustert).length
    const sichtbar = mitAusgemustert ? alle : alle.filter((schuh) => !schuh.Ausgemustert)
    const schuhe = sichtbar.filter(
        (s) =>
            (!filter.hersteller || String(s.Modell.Hersteller.ID) === filter.hersteller) &&
            (!filter.modell || String(s.Modell_ID) === filter.modell) &&
            (!filter.zusatz || s.Modell.Jugend === (filter.zusatz === "jugend")) &&
            passtAllgemein(filter, s.Groese, s.Saison, s.ImVerleih),
    )

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Skischuhe Liste</h1>

            <MaterialFilter
                werte={filter}
                onChange={setFilter}
                hersteller={optionen.hersteller}
                modelle={optionen.modelle}
                zusatz={{ label: "Jugend", optionen: JUGEND_OPTIONEN }}
                saisons={optionen.saisons}
                massLabel="Größe"
                masseinheit="MP"
                anzahl={schuhe.length}
                gesamt={sichtbar.length}
            >
                <AusgemusterteFilter wert={mitAusgemustert} onChange={setMitAusgemustert} anzahl={anzahlAusgemustert} />
            </MaterialFilter>

            {schuhe.length === 0 ? (
                <p>{sichtbar.length === 0 ? "Keine Skischuhe gefunden" : "Keine Skischuhe passend zum Filter"}</p>
            ) : (
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
            )}
        </div>
    )
}
