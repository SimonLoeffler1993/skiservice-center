import { Auftrag } from "@/types/skiservicetypes";

// Abgeleitete Werte eines Auftrags für Kachel und Listenzeile
export function auftragUebersicht(auftrag: Auftrag) {
    return {
        nummer: auftrag.name ?? `Auftrag #${auftrag.id}`,
        kunde: [auftrag.kunde.Nachname, auftrag.kunde.Vorname].filter(Boolean).join(", ") || "Ohne Kunde",
        // Ski, die weder fertig noch abgeholt sind
        offen: auftrag.skis.filter((ski) => ski.status !== 1 && ski.status !== 2).length,
        gesamt: auftrag.skis.reduce((summe, ski) => summe + ski.preis + (ski.bindung_check ? ski.bindung_preis : 0), 0),
    };
}
