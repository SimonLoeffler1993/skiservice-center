import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import { Truck, RotateCcw } from "lucide-react";

export default function SaisonverleihCardStatus({ status }: { status: SaisonverleihRead["Zurueck"] }) {
    const isUnterwegs = status === true;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium border ${isUnterwegs
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
            title={`Status: ${status}`}
        >
            {isUnterwegs ? (
                <Truck className="h-3.5 w-3.5" />
            ) : (
                <RotateCcw className="h-3.5 w-3.5" />
            )}
            {status === true ? "Zurück" : "Unterwegs"}
        </span>
    );
}