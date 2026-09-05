"use client"

// import { Pencil, Trash2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { skiStoeckeOptions } from "@/hooks/useSchuhMaterialOptions"
import { useQuery } from "@tanstack/react-query"



export default function SkiStoeckeListe() {
    const { data: STOECKE, isLoading, error } = useQuery(skiStoeckeOptions)
    
    if (isLoading) return <p>Stöcke werden geladen...</p>
    if (error) return <p>Fehler beim Laden der Stöcke: {error.message}</p>
    if (!STOECKE?.success) return <p>Stöcke konnten nicht geladen werden</p>

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Stöcke</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* <TableHead>Bezeichnung</TableHead> */}
                            {/* <TableHead className="w-24 text-right">Aktionen</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {STOECKE.data .map((stock) => (
                            <TableRow key={stock.ID}>
                                <TableCell>{stock.Bezeichnung}</TableCell>
                                {/* <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Pencil className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="size-4" />
                                    </Button>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}