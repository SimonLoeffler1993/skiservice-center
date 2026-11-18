import { SaisonverleihRead } from "@/types/saisonverleihtypes";

// z.B. "2 Ski · 1 Schuh · 1 Stock", ohne Teile "Nur Preis"
function materialText(verleih: SaisonverleihRead) {
    const material = verleih.Material ?? [];
    const teile = [
        [material.filter((m) => m.skinr).length, "Ski"],
        [material.filter((m) => m.schuhnr).length, "Schuh"],
        [material.filter((m) => m.stockbez_ID).length, "Stock"],
    ] as const;
    const text = teile.filter(([anzahl]) => anzahl > 0).map(([anzahl, name]) => `${anzahl} ${name}`).join(" · ");
    return text || `${material.length} × nur Preis`;
}

// Abgeleitete Werte eines Verleihs für Kachel und Listenzeile
export function verleihUebersicht(verleih: SaisonverleihRead) {
    const material = verleih.Material ?? [];
    return {
        kunde: [verleih.Kunde?.Nachname, verleih.Kunde?.Vorname].filter(Boolean).join(", ") || "Ohne Kunde",
        gesamt: material.reduce((summe, m) => summe + m.Preis, 0),
        anzahl: material.length,
        geprueft: material.filter((m) => m.BindungGeprueft).length,
        // Bindungsfortschritt nur, solange der Verleih vorbereitet wird
        zeigeBindung: material.length > 0 && (verleih.Status === "vorbereitung" || verleih.Status === "vorbereitet"),
        // "Nicht benachrichtigt" nur, wenn der Verleih abholbereit ist
        zeigeBenachrichtigt: verleih.Benachrichtigt !== "nein" || verleih.Status === "vorbereitet",
        materialText: materialText(verleih),
    };
}
