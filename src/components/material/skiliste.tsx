"use client"
import { startTransition, use, useState } from "react"

import { type Ski } from "@/types/materialtypes"
import { useEigenSkiContext } from "@/context/eigenski-context"
import { useSkiModellContext } from "@/context/skimodell-context"
import SkiListCard from "./skilistcard"
import { AusgemusterteFilter } from "./bearbeiten/MaterialAktionen"

export default function SkiListe({ skis }: { skis: Ski[] }) {
    const [mitAusgemustert, setMitAusgemustert] = useState(false)
    const { refreshEigenSkisPromise } = useEigenSkiContext()
    const { modellPromise } = useSkiModellContext()
    const modelle = use(modellPromise)

    const anzahlAusgemustert = skis.filter((ski) => ski.Ausgemustert).length
    const data = mitAusgemustert ? skis : skis.filter((ski) => !ski.Ausgemustert)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Ski Liste</h1>
                <AusgemusterteFilter wert={mitAusgemustert} onChange={setMitAusgemustert} anzahl={anzahlAusgemustert} />
            </div>

            {data.length === 0 ? (
                <p>Keine Skis gefunden</p>
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
