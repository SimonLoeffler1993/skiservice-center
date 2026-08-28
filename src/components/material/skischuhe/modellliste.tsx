"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { schuModelleOptions } from "@/hooks/useSchuhMaterialOptions";

export default function SchuhModelleListe() {
    const { data, isLoading, error } = useQuery(schuModelleOptions)

    if (isLoading) return <p>Schuhmodelle werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Schuhmodelle.</p>

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
                            {modell.Jugend && (
                                <span className="rounded-md bg-muted px-2 py-1 text-xs">Jugend</span>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}