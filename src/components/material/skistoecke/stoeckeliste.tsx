"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { skiStoeckeVerwaltungOptions } from "@/hooks/useSchuhMaterialOptions"
import { aendereStockMaterial } from "@/lib/materialbearbeitenactions"
import FeldDialog from "../bearbeiten/FeldDialog"
import MaterialAktionen, { AusgemustertBadge, AusgemusterteFilter } from "../bearbeiten/MaterialAktionen"

export default function SkiStoeckeListe() {
    // Alle Stöcke inkl. ausgemusterter, die Auswahl im Verleih nutzt eine eigene Liste
    const { data: STOECKE, isLoading, error } = useQuery(skiStoeckeVerwaltungOptions)
    const queryClient = useQueryClient()
    const [mitAusgemustert, setMitAusgemustert] = useState(false)

    if (isLoading) return <p>Stöcke werden geladen...</p>
    if (error) return <p>Fehler beim Laden der Stöcke: {error.message}</p>
    if (!STOECKE?.success) return <p>Stöcke konnten nicht geladen werden</p>

    // Beide Stocklisten (Verwaltung und Verleih) neu laden
    const neuLaden = () => queryClient.invalidateQueries({ queryKey: ["skistoecke"] })
    const anzahlAusgemustert = STOECKE.data.filter((stock) => stock.Ausgemustert).length
    const stoecke = mitAusgemustert ? STOECKE.data : STOECKE.data.filter((stock) => !stock.Ausgemustert)

    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Stöcke</CardTitle>
                <AusgemusterteFilter wert={mitAusgemustert} onChange={setMitAusgemustert} anzahl={anzahlAusgemustert} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bezeichnung</TableHead>
                            <TableHead className="w-40 text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stoecke.map((stock) => (
                            <TableRow key={stock.ID} className={stock.Ausgemustert ? "opacity-60" : ""}>
                                <TableCell>
                                    <span className="flex items-center gap-2">
                                        {stock.Bezeichnung}
                                        {stock.Ausgemustert && <AusgemustertBadge />}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <MaterialAktionen
                                        art="stock"
                                        id={stock.ID}
                                        bezeichnung={`Stock ${stock.Bezeichnung}`}
                                        ausgemustert={stock.Ausgemustert}
                                        onGeaendert={neuLaden}
                                        bearbeiten={
                                            <FeldDialog
                                                titel={`Stock ${stock.Bezeichnung} bearbeiten`}
                                                startwerte={{ Bezeichnung: stock.Bezeichnung }}
                                                felder={[{ name: "Bezeichnung", label: "Bezeichnung" }]}
                                                onSpeichern={async (werte) => {
                                                    const antwort = await aendereStockMaterial(stock.ID, String(werte.Bezeichnung))
                                                    if (!antwort.success) return antwort.error
                                                    neuLaden()
                                                    return null
                                                }}
                                            />
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
