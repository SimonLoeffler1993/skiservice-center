import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schuhHerstellerOptions } from "@/hooks/useSchuhMaterialOptions";
import { useQuery } from "@tanstack/react-query";


export default function SchuhHerstellerListe() {
    const { data, isLoading, error } = useQuery(schuhHerstellerOptions)

    if (isLoading) return <p>Hersteller werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Hersteller.</p>

    if (!data) return null

    return (
        <Card className="m-2">
            <CardHeader>
                <CardTitle>Skischuh Hersteller</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <ul className="divide-y rounded-md border">
                        {data.map((hersteller) => (
                            <li key={hersteller.ID} className="flex items-center justify-between gap-4 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold">
                                        {hersteller.Name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{hersteller.Name}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}