import { MaterialRead } from "@/types/materialtypes";

type Props = {
    material: MaterialRead;
};

export default function SaisonVerleiAnzeigeMaterialPreis({ material }: Props) {
    return (
        <div className="px-3 pt-2 pb-0 mx-2 mt-0 mb-0 border-t flex items-center justify-between">
            <span className="text-sm font-medium">Preis</span>
            <span className="text-base font-semibold text-foreground">{material.Preis}€</span>
        </div>
    );
}