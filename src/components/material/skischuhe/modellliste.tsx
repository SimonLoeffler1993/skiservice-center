"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { schuhHerstellerOptions, schuModelleOptions, skiSchuheOptions } from "@/hooks/useSchuhMaterialOptions";
import { aendereSchuhModell } from "@/lib/materialbearbeitenactions";
import FeldDialog from "../bearbeiten/FeldDialog";
import StammdatenLoeschenDialog from "../bearbeiten/StammdatenLoeschenDialog";

export default function SchuhModelleListe() {
    const { data, isLoading, error } = useQuery(schuModelleOptions)
    const { data: hersteller } = useQuery(schuhHerstellerOptions)
    const queryClient = useQueryClient()

    // Modellnamen stehen auch bei den Schuhen
    function neuLaden() {
        queryClient.invalidateQueries({ queryKey: schuModelleOptions.queryKey })
        queryClient.invalidateQueries({ queryKey: skiSchuheOptions.queryKey })
    }

    if (isLoading) return <p>Schuhmodelle werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Schuhmodelle: {error.message}</p>

    if (!data?.success) return <p>Schuhmodelle konnten nicht geladen werden</p>

    return (
        <Card className="mx-auto mt-6 max-w-4xl">
            <CardHeader>
                <CardTitle>Vorhandene Modelle</CardTitle>
            </CardHeader>
            <CardContent>
                <span className="text-sm text-muted-foreground">gefunden: {data.data.length}</span>
                <ul className="divide-y rounded-md border">
                    {data.data.map((modell) => (
                        <li key={modell.ID} className="flex items-center justify-between gap-4 p-4">
                            <div>
                                <p className="font-medium">{modell.Modell}</p>
                                <p className="text-sm text-muted-foreground">Hersteller: {modell.Hersteller.Name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {modell.Jugend && (
                                    <span className="rounded-md bg-muted px-2 py-1 text-xs">Jugend</span>
                                )}
                                <FeldDialog
                                    titel={`Modell ${modell.Modell} bearbeiten`}
                                    startwerte={{ Modell: modell.Modell, Hersteller_ID: String(modell.Hersteller_ID), Jugend: modell.Jugend }}
                                    felder={[
                                        { name: "Modell", label: "Modell" },
                                        { name: "Hersteller_ID", label: "Hersteller", typ: "auswahl", optionen: (hersteller ?? []).map((h) => ({ wert: String(h.ID), text: h.Name })) },
                                        { name: "Jugend", label: "Jugendschuh", typ: "bool" },
                                    ]}
                                    onSpeichern={async (werte) => {
                                        const antwort = await aendereSchuhModell(modell.ID, {
                                            Modell: String(werte.Modell),
                                            Hersteller_ID: Number(werte.Hersteller_ID),
                                            Jugend: werte.Jugend === true,
                                        })
                                        if (!antwort.success) return antwort.error
                                        neuLaden()
                                        return null
                                    }}
                                />
                                <StammdatenLoeschenDialog
                                    art="schuhmodell"
                                    id={modell.ID}
                                    bezeichnung={`Modell ${modell.Modell}`}
                                    verweis={["Schuh", "Schuhen"]}
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