"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { quittungOptions } from "@/hooks/useQuittungOptions";
import QuittungsBetrag from "./QuittungsBetrag";

type QuittungBezahlInfoProps = {
    quittungID: number;
}

// TODO Bezahlt am 
// TODO Datum Formatierung

export default function QuittungBezahlInfo({ quittungID }: QuittungBezahlInfoProps) {
    const { data: quittung } = useSuspenseQuery(quittungOptions(quittungID));
    // console.log(quittung);
    if (!quittung){
        return <div className="border border-gray-300 flex flex-col gap-2 p-4 rounded-md">
            Keine Quittungsdaten gefunden.
        </div>
    } 

    return (
        <div className="border-t border-gray-300 flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2 ps-4">
                <span className="font-bold">Quittung {quittung?.Name}</span>
                <span className="text-sm text-gray-500">vom {quittung?.Erstellt_Am}</span>
            </div>
            <QuittungsBetrag quittungdata={quittung} />
        </div>

    );
}