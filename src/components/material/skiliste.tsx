"use client"
import { startTransition, use, useMemo, useState } from "react"

import { type Ski } from "@/types/materialtypes"
import { useEigenSkiContext } from "@/context/eigenski-context"
import { useSkiModellContext } from "@/context/skimodell-context"
import SkiListCard from "./skilistcard"
import { AusgemusterteFilter } from "./bearbeiten/MaterialAktionen"
import MaterialFilter, { eindeutigeOptionen, LEERER_FILTER, passtAllgemein } from "./MaterialFilter"

export default function SkiListe({ skis }: { skis: Ski[] }) {
    const [mitAusgemustert, setMitAusgemustert] = useState(false)
    const [filter, setFilter] = useState(LEERER_FILTER)
    const { refreshEigenSkisPromise } = useEigenSkiContext()
    const { modellPromise } = useSkiModellContext()
    const modelle = use(modellPromise)

    const anzahlAusgemustert = skis.filter((ski) => ski.Ausgemustert).length
    const sichtbar = mitAusgemustert ? skis : skis.filter((ski) => !ski.Ausgemustert)

    // Nur Werte anbieten, die in der Liste vorkommen
    const optionen = useMemo(() => {
        const hersteller = eindeutigeOptionen(skis.map((s) => ({ wert: String(s.Modell.Hersteller.ID), text: s.Modell.Hersteller.Name })))
        const modellOptionen = eindeutigeOptionen(
            skis
                .filter((s) => !filter.hersteller || String(s.Modell.Hersteller.ID) === filter.hersteller)
                .map((s) => ({ wert: String(s.Modell_ID), text: s.Modell.Modell })),
        )
        const arten = eindeutigeOptionen(skis.map((s) => ({ wert: String(s.Modell.Art.ID), text: s.Modell.Art.Art })))
        const saisons = eindeutigeOptionen(skis.map((s) => ({ wert: s.Saison, text: s.Saison })))
        return { hersteller, modelle: modellOptionen, arten, saisons }
    }, [skis, filter.hersteller])

    const data = sichtbar.filter(
        (s) =>
            (!filter.hersteller || String(s.Modell.Hersteller.ID) === filter.hersteller) &&
            (!filter.modell || String(s.Modell_ID) === filter.modell) &&
            (!filter.zusatz || String(s.Modell.Art.ID) === filter.zusatz) &&
            passtAllgemein(filter, s.Laenge, s.Saison, s.ImVerleih),
    )

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Ski Liste</h1>

            <MaterialFilter
                werte={filter}
                onChange={setFilter}
                hersteller={optionen.hersteller}
                modelle={optionen.modelle}
                zusatz={{ label: "Art", optionen: optionen.arten }}
                saisons={optionen.saisons}
                massLabel="Länge"
                masseinheit="cm"
                anzahl={data.length}
                gesamt={sichtbar.length}
            >
                <AusgemusterteFilter wert={mitAusgemustert} onChange={setMitAusgemustert} anzahl={anzahlAusgemustert} />
            </MaterialFilter>

            {data.length === 0 ? (
                <p>{sichtbar.length === 0 ? "Keine Skis gefunden" : "Keine Skis passend zum Filter"}</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.map((s) => (
                        <SkiListCard
                            key={s.ID}
                            ski={s}
                            modelle={modelle}
                            onGeaendert={() => startTransition(() => refreshEigenSkisPromise())}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
