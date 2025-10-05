import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MaterialRead } from "@/types/materialtypes";
import { Euro } from "lucide-react";

type UebersichtGesamtPreisProps = {
    Material: MaterialRead[];
};

export default function SaisonVerleiAnzeigeUebersichtGesamtPreis({ Material }: UebersichtGesamtPreisProps) {

    const gesamtpreis = Material.reduce((sum, material) => sum + material.Preis, 0);
    return (
        <Card className="bg-muted/50 m-0 w-full md:w-fit md:min-w-[220px] md:max-w-[320px]">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
                    <Euro className="h-4 w-4" />
                    Gesamtpreis
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-2xl font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{gesamtpreis.toFixed(2)}€</div>
            </CardContent>
        </Card>
    );
}