import { PackageOpen, RotateCcw, Truck, type LucideIcon } from "lucide-react";

import { VerleihStatus } from "@/types/saisonverleihtypes";

export const STATUS_ANZEIGE: Record<VerleihStatus, { text: string; icon: LucideIcon; farbe: string }> = {
    vorbereitung: { text: "In Vorbereitung", icon: PackageOpen, farbe: "bg-blue-50 text-blue-700 border-blue-200" },
    unterwegs: { text: "Unterwegs", icon: Truck, farbe: "bg-amber-50 text-amber-700 border-amber-200" },
    zurueck: { text: "Zurückgegeben", icon: RotateCcw, farbe: "bg-green-50 text-green-700 border-green-200" },
};

// Status eines Verleihs: In Vorbereitung -> Unterwegs -> Zurückgegeben
export default function SaisonverleihCardStatus({ status }: { status: VerleihStatus }) {
    const { text, icon: Icon, farbe } = STATUS_ANZEIGE[status];
    return (
        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${farbe}`} title={`Status: ${text}`}>
            <Icon className="h-3.5 w-3.5" />
            {text}
        </span>
    );
}
