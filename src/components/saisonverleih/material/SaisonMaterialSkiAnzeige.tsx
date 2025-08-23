import { Ski } from "@/types/materialtypes";

type SaisonMaterialSkiAnzeigeProps = {
    ski: Ski;
}

export default function SaisonMaterialSkiAnzeige({ ski }: SaisonMaterialSkiAnzeigeProps) {
    return (
        <div className="flex flex-row gap-2">
            <p className="text-gray-500">{ski.Modell.Art.Art} {ski.Modell.Modell} </p>
            <p className="text-gray-500">{ski.Laenge} cm</p>
        </div>
    );
}