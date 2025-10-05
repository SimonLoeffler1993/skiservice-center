import { Ruler, Tag } from "lucide-react";
import { MaterialRead } from "@/types/materialtypes";


type Props = {
    material: MaterialRead;
};

export default function SaisonVerleiAnzeigeMaterialSki({ material }: Props) {

    if (!material.Ski) {
        return (
            <div className="p-3 m-2 text-center text-muted-foreground">
                <p>Kein Ski ausgeliehen</p>
            </div>
        );
    }

    return (
        <div className="border-t p-3 m-2 mb-0">
            <div className="text-sm font-medium mb-1">Ski</div>
            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs inline-flex items-center gap-1 font-semibold text-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    {material.Ski?.Modell.Hersteller.Name + " " + material.Ski?.Modell.Modell}
                </span>

                {/* Wrapper verhindert Umbruch der letzten zwei Spans */}
                <span className="flex items-center gap-x-3 flex-nowrap">
                    <span className="inline-flex items-center gap-1">
                        <Ruler className="h-3.5 w-3.5" />
                        {material.Ski?.Laenge} cm
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {material.Ski?.Modell.Art.Art}
                    </span>
                </span>
            </div>
        </div>
    );
}