import { Schuh } from "@/types/materialtypes";

type SaisonMaterialSchuhAnzeigenProps = {
    schuh: Schuh;
}

export default function SaisonMaterialSchuhAnzeigen({schuh}: SaisonMaterialSchuhAnzeigenProps) {
    return (
        <div className="flex flex-wrap gap-x-2">
            <p className="text-gray-500">{schuh.Modell.Hersteller.Name} {schuh.Modell.Modell} </p>
            <p className="text-gray-500">{schuh.Groese}</p>
            {schuh.Sohle && <p className="text-gray-500">Sohle {schuh.Sohle} mm</p>}
        </div>
    );
}
