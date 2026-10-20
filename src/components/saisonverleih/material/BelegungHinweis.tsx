import { format, parseISO } from "date-fns";

import { VerleihBelegung } from "@/types/saisonverleihtypes";

type BelegungHinweisProps = {
    belegungen: VerleihBelegung[] | null;
    fehler: string | null;
    isPending: boolean;
};

function zeitraumText(belegung: VerleihBelegung) {
    if (belegung.Art === "tag" && belegung.Start_Am && belegung.Ende_Am) {
        return `${format(parseISO(belegung.Start_Am), "dd.MM.")}–${format(parseISO(belegung.Ende_Am), "dd.MM.yyyy")}`;
    }
    return "Saisonverleih";
}

export default function BelegungHinweis({ belegungen, fehler, isPending }: BelegungHinweisProps) {
    if (isPending) {
        return <p className="mt-1 text-sm text-gray-500">Prüfe Belegung im Zeitraum...</p>;
    }
    if (fehler) {
        return <p className="mt-1 text-sm text-red-600">{fehler}</p>;
    }
    if (!belegungen) return null;
    if (belegungen.length === 0) {
        return <p className="mt-1 text-left text-sm text-green-700">Im gewählten Zeitraum frei.</p>;
    }
    return (
        <div className="mt-1 text-left text-sm text-red-600">
            <p className="font-medium">Im gewählten Zeitraum bereits verliehen:</p>
            <ul className="list-disc pl-5">
                {belegungen.map((b) => (
                    <li key={`${b.ID}-${b.Material}`}>{b.Name} ({zeitraumText(b)}, {b.Kunde})</li>
                ))}
            </ul>
        </div>
    );
}
