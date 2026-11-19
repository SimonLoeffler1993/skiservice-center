import { Ski } from "@/types/skiservicetypes";

// Fertig (1) oder schon abgeholt (2): hier gibt es nichts mehr fertig zu stellen
export function istFertig(ski: Ski) {
    return ski.status === 1 || ski.status === 2;
}

// Bindungscheck beauftragt und noch nicht geprüft
export function bindungOffen(ski: Ski) {
    return !!ski.bindung_check && !ski.bindung_status;
}

export function anzahlSki(anzahl: number) {
    return anzahl === 1 ? "Ski" : `${anzahl} Ski`;
}
