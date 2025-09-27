import { Ruler, Tag } from "lucide-react";
import { MaterialRead } from "@/types/materialtypes";


type Props = {
    material: MaterialRead;
};

export default function SaisonVerleiAnzeigeMaterialStock({ material }: Props) {

    if (!material.Stock) {
        return (
            <div className="p-3 m-2 text-center text-muted-foreground">
                <p>Kein Stock ausgeliehen</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border p-3 m-2 mb-0">
            <div className="text-sm font-medium mb-1">Stock</div>
            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> {material.Stock.Bezeichnung}
                </span>
                <span className="inline-flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" /> {material.stocklaenge} cm
                </span>
            </div>
        </div>
    );
}