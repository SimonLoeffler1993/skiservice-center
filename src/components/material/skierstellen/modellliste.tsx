"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSkiModellContext } from "@/context/skimodell-context"
import { use } from "react"

export default function SkiModellliste() {
    const { modellPromise } = useSkiModellContext();
    const modell = use(modellPromise);
    return (
        <Card className="mx-auto mt-6 max-w-4xl">
            <CardHeader>
                <CardTitle>Vorhandene Modelle</CardTitle>
            </CardHeader>
            <CardContent>
                <span className="text-sm text-muted-foreground">gefunden: {modell.length}</span>
                <ul className="divide-y rounded-md border">
                    {modell.map((modell) => (
                        <li key={modell.ID} className="flex items-center justify-between gap-4 p-4">
                            <div>
                                <p className="font-medium">{modell.Modell}</p>
                                <p className="text-sm text-muted-foreground">Hersteller: {modell.Hersteller.Name}</p>
                            </div>
                            <span className="rounded-md bg-muted px-2 py-1 text-xs">{modell.Art.Art}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}