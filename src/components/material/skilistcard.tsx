import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Ski } from "@/types/materialtypes";

type SkiLIstCardProps = {
    ski: Ski
}

export default function SkiListCard({ ski }: SkiLIstCardProps) {
    const formatEUR = (n: number) =>
        new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)
    
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-base">{ski.Modell.Modell}</CardTitle>
                <CardDescription>{ski.Modell.Hersteller.Name} • {ski.Modell.Art.Art}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Länge</div>
                    <div className="text-right">{ski.Laenge} cm</div>
                    <div className="text-muted-foreground">Ski-Nr.</div>
                    <div className="text-right">{ski.SkiNr}</div>
                    <div className="text-muted-foreground">EK</div>
                    <div className="text-right">{formatEUR(ski.EK)}</div>
                    <div className="text-muted-foreground">VK</div>
                    <div className="text-right font-medium">{formatEUR(ski.VK)}</div>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <div className="text-sm text-muted-foreground">Saison {ski.Saison}</div>
                <div className="text-sm font-medium">{formatEUR(ski.VK)}</div>
            </CardFooter>
        </Card>
    )
}