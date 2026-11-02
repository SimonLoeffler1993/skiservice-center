"use client";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { quittungOptions } from "@/hooks/useQuittungOptions";
import QuittungsBetrag from "./QuittungsBetrag";
import QuittungLexware from "./QuittungLexware";
import QuittungZuweisungAktionen from "./QuittungZuweisungAktionen";
import { QuittungZiel } from "@/lib/quittungactions";

type QuittungBezahlInfoProps = {
    quittungID: number;
    // Mit Angabe kann ein von Hand zugewiesener Beleg geändert oder aufgehoben werden
    ziel?: QuittungZiel;
}

// TODO Bezahlt am 
// TODO Datum Formatierung

export default function QuittungBezahlInfo({ quittungID, ziel }: QuittungBezahlInfoProps) {
    // useQuery statt useSuspenseQuery: Der Abruf läuft über eine Server Action und darf nicht
    // während des Renderns starten (sonst "Cannot update a component (Router) while rendering"),
    // z.B. direkt nach dem Zuweisen einer neuen Quittung.
    const { data: quittung, isPending, error } = useQuery(quittungOptions(quittungID));
    const queryClient = useQueryClient();
    const statusAktualisiert = quittung?.StatusAktualisiert ?? false;
    // Einzelwerte statt des Objekts, das bei jedem Rendern neu entsteht (sonst Endlosschleife)
    const zielArt = ziel?.art;
    const zielId = ziel?.id;

    // Lexware meldet bezahlt und die Datenbank wurde angepasst: Auftrag bzw. Verleih neu laden,
    // damit Badge und Sperren den neuen Stand zeigen
    useEffect(() => {
        if (!statusAktualisiert || !zielArt) return;
        if (zielArt === "auftrag") {
            queryClient.invalidateQueries({ queryKey: ["serviceAuftragDetails", zielId] });
            queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        } else {
            queryClient.invalidateQueries({ queryKey: ["saisonverleihDetails", zielId] });
            queryClient.invalidateQueries({ queryKey: ["saisonverleihList"] });
        }
    }, [statusAktualisiert, zielArt, zielId, queryClient]);

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
            {ziel && quittung.ManuellZugewiesen && <QuittungZuweisungAktionen quittungID={quittung.ID} ziel={ziel} />}
        </div>

    );
}