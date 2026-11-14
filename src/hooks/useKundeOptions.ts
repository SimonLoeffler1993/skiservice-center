import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { holeKunde, holeKundeHistorie, holeKundenListe } from "@/lib/kundeactions";
import { KundenSortierung } from "@/types/skikundentypes";

// Kunde der Kundenseite
export const kundeOptions = (kundeID: number) => queryOptions({
    queryKey: ["kunde", kundeID],
    queryFn: async () => {
        const antwort = await holeKunde(kundeID);
        // Fehler werfen, damit TanStack Query den Fehlerzustand setzt
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
});

// Aufträge, Verleihe und Quittungen des Kunden über alle Saisons
export const kundeHistorieOptions = (kundeID: number) => queryOptions({
    queryKey: ["kunde", kundeID, "historie"],
    queryFn: async () => {
        const antwort = await holeKundeHistorie(kundeID);
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
});

// Eine Seite der Kundenliste im Kundenbereich
export const kundenListeOptions = (seite: number, sortierung: KundenSortierung, suche: string) => queryOptions({
    queryKey: ["kundenListe", seite, sortierung, suche],
    queryFn: async () => {
        const antwort = await holeKundenListe(seite, sortierung, suche);
        if (!antwort.success) throw new Error(antwort.error);
        return antwort.data;
    },
    // Beim Blättern und Suchen bleibt die bisherige Seite stehen, bis die neue da ist
    placeholderData: keepPreviousData,
});
