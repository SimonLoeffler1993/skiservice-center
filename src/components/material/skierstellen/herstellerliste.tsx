"use client"
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSkiHerstellerContext } from "@/context/skihersteller-context"

export default function Herstellerliste() {
    const { herstellerPromise } = useSkiHerstellerContext();
    const hersteller = use(herstellerPromise);
    // TODO: Suche und Inaktiv Schalten UI Ellemente wurden auskommentiert
    return (
        <Card className="m-2">
            <CardHeader>
                <CardTitle>Ski Hersteller</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* <Input placeholder="Suchen…" aria-label="Hersteller suchen" /> */}

                    <ul className="divide-y rounded-md border">
                        {hersteller.map((hersteller) => (
                            <li key={hersteller.ID} className="flex items-center justify-between gap-4 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold">
                                        {hersteller.Name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{hersteller.Name}</p>
                                    </div>
                                </div>
                                {/* <div className="flex items-center gap-2">
                                    <Button className="h-8 px-3">Bearbeiten</Button>
                                    <Button className="h-8 px-3">Löschen</Button>
                                </div> */}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}