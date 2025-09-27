import { User, Package } from "lucide-react";
import { MaterialRead } from "@/types/materialtypes";

type FahrerProps = {
    material: MaterialRead;
};

export default function SaisonVerleiAnzeigeMaterialFahrer({ material }: FahrerProps) {
    if (material.SkiFahrerName) {
        return (
            <div className="flex items-center gap-2 m-2 text-md" >
                <User className="h-4 w-4 text-muted-foreground" />
                <strong>{material.SkiFahrerName}</strong>
            </div>
        );
    }

    // Wen keine SkifahrerName vorhanden ist
    return (
        <div className="flex items-center gap-2 m-2 text-md" >
            <Package className="h-3.5 w-3.5" /> Ausrüstung #{material.ID}
        </div>
    );
}