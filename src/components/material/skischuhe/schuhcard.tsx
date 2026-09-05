import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Schuh } from "@/types/materialtypes";

type SkischuhProps = {
    schuh: Schuh
}

export default function SkischuhCard ({schuh}: SkischuhProps) {
    const formatEUR = (n: number) =>
        new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)
    
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-base">{schuh.Modell.Modell}</CardTitle>
                <CardDescription>
                    {schuh.Modell.Hersteller.Name}
                    {schuh.Modell.Jugend && (
                        <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs">Jugend</span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Größe</div>
                    <div className="text-right">{schuh.Groese} MP</div>
                    <div className="text-muted-foreground">Schuh-Nr.</div>
                    <div className="text-right">{schuh.ID}</div>
                    <div className="text-muted-foreground">EK</div>
                    <div className="text-right">{formatEUR(schuh.EK)}</div>
                    <div className="text-muted-foreground">VK</div>
                    <div className="text-right font-medium">{formatEUR(schuh.VK)}</div>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <div className="text-sm text-muted-foreground">Saison {schuh.Saison}</div>
                {/* <div className="text-sm font-medium">{formatEUR(ski.VK)}</div> */}
            </CardFooter>
        </Card>
    )
};