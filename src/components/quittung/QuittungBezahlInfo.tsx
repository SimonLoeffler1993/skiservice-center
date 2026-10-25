"use client";
import { useQuery } from "@tanstack/react-query";

import { quittungOptions } from "@/hooks/useQuittungOptions";
import QuittungsBetrag from "./QuittungsBetrag";
import QuittungLexware from "./QuittungLexware";

type QuittungBezahlInfoProps = {
    quittungID: number;
}

// TODO Bezahlt am 
// TODO Datum Formatierung

export default function QuittungBezahlInfo({ quittungID }: QuittungBezahlInfoProps) {
    // useQuery statt useSuspenseQuery: Der Abruf läuft über eine Server Action und darf nicht
    // während des Renderns starten (sonst "Cannot update a component (Router) while rendering"),
    // z.B. direkt nach dem Zuweisen einer neuen Quittung.
    const { data: quittung, isPending, error } = useQuery(quittungOptions(quittungID));

    if (isPending) {
        return <div className="text-sm text-gray-500">Lade Bezahlinformationen...</div>
    }
    if (error) {
        return <div className="text-sm text-destructive">Quittung konnte nicht geladen werden.</div>
    }
    if (!quittung){
        return <div className="border border-gray-300 flex flex-col gap-2 p-4 rounded-md">
            Keine Quittungsdaten gefunden.
        </div>
    } 

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">Quittung {quittung.Nummer ?? quittung.Name}</span>
                <span className="text-sm text-gray-500">vom {quittung?.Erstellt_Am}</span>
                <QuittungLexware quittung={quittung} />
            </div>
            <QuittungsBetrag quittungdata={quittung} />
        </div>

    );
}