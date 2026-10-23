"use client"
import { startTransition, Suspense, use, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSkiArtContext } from "@/context/skiart-context"
import { useSkiModellContext } from "@/context/skimodell-context"
import { useEigenSkiContext } from "@/context/eigenski-context"
import { aendereSkiArt, createSkiArt } from "@/lib/materialbearbeitenactions"
import FeldDialog from "../bearbeiten/FeldDialog"
import StammdatenLoeschenDialog from "../bearbeiten/StammdatenLoeschenDialog"

// Skiarten verwalten, z.B. Allmountain, Piste, Kinder
export default function SkiArtForm() {
    const { refreshArtPromise } = useSkiArtContext()
    const [name, setName] = useState("")
    const [meldung, setMeldung] = useState<{ erfolg: boolean; text: string } | null>(null)
    const [isPending, startSpeichern] = useTransition()

    function anlegen(e: React.FormEvent) {
        e.preventDefault()
        startSpeichern(async () => {
            const antwort = await createSkiArt(name)
            if (!antwort.success) {
                setMeldung({ erfolg: false, text: antwort.error })
                return
            }
            setMeldung({ erfolg: true, text: `Skiart ${antwort.data.Art} angelegt.` })
            setName("")
            startTransition(() => refreshArtPromise())
        })
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="m-2">
                <CardHeader>
                    <CardTitle>Neue Skiart anlegen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={anlegen} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="skiart" className="text-sm font-medium">Bezeichnung</label>
                            <Input id="skiart" value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Race, Park, Skitour" maxLength={100} />
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            {meldung && (
                                <p className={`mr-auto text-sm ${meldung.erfolg ? "text-green-700" : "text-red-500"}`}>{meldung.text}</p>
                            )}
                            <Button disabled={isPending || !name.trim()} type="submit">
                                {isPending ? "Speichern…" : "Speichern"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Suspense fallback={<p>Lade Skiarten…</p>}>
                <SkiArtListe />
            </Suspense>
        </div>
    )
}

function SkiArtListe() {
    const { artPromise, refreshArtPromise } = useSkiArtContext()
    const { refreshModellPromise } = useSkiModellContext()
    const { refreshEigenSkisPromise } = useEigenSkiContext()
    const arten = use(artPromise)

    // Die Art steht auch bei Modellen und Ski
    function neuLaden() {
        startTransition(() => {
            refreshArtPromise()
            refreshModellPromise()
            refreshEigenSkisPromise()
        })
    }

    return (
        <Card className="m-2">
            <CardHeader>
                <CardTitle>Skiarten</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="divide-y rounded-md border">
                    {arten.map((art) => (
                        <li key={art.ID} className="flex items-center justify-between gap-4 p-4">
                            <p className="font-medium">{art.Art}</p>
                            <div className="flex items-center gap-1">
                                <FeldDialog
                                    titel={`Skiart ${art.Art} bearbeiten`}
                                    startwerte={{ Art: art.Art }}
                                    felder={[{ name: "Art", label: "Bezeichnung" }]}
                                    onSpeichern={async (werte) => {
                                        const antwort = await aendereSkiArt(art.ID, String(werte.Art))
                                        if (!antwort.success) return antwort.error
                                        neuLaden()
                                        return null
                                    }}
                                />
                                <StammdatenLoeschenDialog
                                    art="skiart"
                                    id={art.ID}
                                    bezeichnung={`Skiart ${art.Art}`}
                                    verweis={["Modell bzw. Preis", "Modellen bzw. Preisen"]}
                                    onGeloescht={neuLaden}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
