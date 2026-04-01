import { QuittungRead } from "@/types/quittungentypes";

type QuittungBezahlInfoProps = {
    quittungdata: QuittungRead
}

export default function QuittungsBetrag({ quittungdata }: QuittungBezahlInfoProps) {
    if (!quittungdata?.BezahlInfo) {
        return (
            <div className="border border-gray-300 flex flex-col gap-2 p-4 rounded-md">
                Keine Daten aus der Buchhaltung
            </div>
        )
    }

    if (quittungdata.BezahlInfo.Offener_Betrag === 0) {
        return (
            <div className="border border-emerald-200 flex items-center flex-row gap-1 px-4 py-2 rounded-md bg-emerald-100">
                <span className="font-bold text-emerald-800">Vollständig bezahlt</span>
                <span className="text-sm text-emerald-600">am {quittungdata.BezahlInfo.Bezahlt_Am}</span>
            </div>
        )
    }

    return (
        <div className="border border-amber-200 flex flex-row gap-1 px-4 py-2 rounded-md bg-amber-100">
            <span className="font-bold text-amber-800">zu bezahlen: {quittungdata.BezahlInfo.Offener_Betrag?.toFixed(2)} €</span>
        </div>
    );
}