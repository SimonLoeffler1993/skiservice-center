"use client";

import { useQueryClient } from "@tanstack/react-query";

import { Kunde } from "@/types/skikundentypes";

// Alles, was Kundendaten eingebettet enthält (Name auf Karten, Detailseiten, Quittungen)
const MIT_KUNDENDATEN = ["serviceAuftragDetails", "saisonverleihDetails", "skiserviceList", "saisonverleihList", "quittungenListe", "werkstatt"];

// Nach dem Bearbeiten: Kunde sofort übernehmen und alles neu laden, was seine Daten zeigt
export function useKundeGeaendert() {
    const queryClient = useQueryClient();
    return (kunde: Kunde) => {
        queryClient.setQueryData(["kunde", kunde.ID], kunde);
        queryClient.invalidateQueries({ queryKey: ["kunde", kunde.ID, "historie"] });
        for (const schluessel of MIT_KUNDENDATEN) {
            queryClient.invalidateQueries({ queryKey: [schluessel] });
        }
    };
}
