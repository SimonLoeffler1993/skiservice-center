import { format, parseISO } from "date-fns";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VerleihBelegung } from "@/types/saisonverleihtypes";

type BelegungHinweisProps = {
    belegungen: VerleihBelegung[] | null;
    fehler: string | null;
    isPending: boolean;
    // Tagesverleih: Belegung im gewählten Zeitraum, sonst heute
    tagesverleih: boolean;
    // Mit Angabe kann ein belegtes Teil trotzdem übernommen werden
    onTrotzdem?: () => void;
    uebernommen?: boolean;
};

function zeitraumText(belegung: VerleihBelegung) {
    if (belegung.Art === "tag" && belegung.Start_Am && belegung.Ende_Am) {
        return `${format(parseISO(belegung.Start_Am), "dd.MM.")}–${format(parseISO(belegung.Ende_Am), "dd.MM.yyyy")}`;
    }
    return "Saisonverleih";
}

export default function BelegungHinweis({ belegungen, fehler, isPending, tagesverleih, onTrotzdem, uebernommen = false }: BelegungHinweisProps) {
    if (isPending) {
        return <p className="mt-1 text-sm text-gray-500">{tagesverleih ? "Prüfe Belegung im Zeitraum..." : "Prüfe Belegung..."}</p>;
    }
    if (fehler) {
        return <p className="mt-1 text-sm text-red-600">{fehler}</p>;
    }
    if (!belegungen) return null;
    if (belegungen.length === 0) {
        return <p className="mt-1 text-left text-sm text-green-700">{tagesverleih ? "Im gewählten Zeitraum frei." : "Nicht verliehen."}</p>;
    }
    return (
        <div className={`mt-1 space-y-2 text-left text-sm ${uebernommen ? "text-amber-700" : "text-red-600"}`}>
            <div>
                <p className="font-medium">{tagesverleih ? "Im gewählten Zeitraum bereits verliehen:" : "Bereits verliehen:"}</p>
                <ul className="list-disc pl-5">
                    {belegungen.map((b, index) => (
                        <li key={`${b.ID}-${b.Material}-${index}`}>{b.Name} ({zeitraumText(b)}, {b.Kunde})</li>
                    ))}
                </ul>
            </div>
            {uebernommen ? (
                <p className="flex items-center gap-1.5 font-medium">
                    <TriangleAlert className="h-4 w-4 shrink-0" />
                    Wird trotz Belegung übernommen
                </p>
            ) : (
                onTrotzdem && (
                    <Button type="button" variant="outline" size="sm" className="border-amber-300 text-amber-800 hover:bg-amber-50" onClick={onTrotzdem}>
                        <TriangleAlert className="h-4 w-4" />
                        Trotzdem übernehmen
                    </Button>
                )
            )}
        </div>
    );
}
