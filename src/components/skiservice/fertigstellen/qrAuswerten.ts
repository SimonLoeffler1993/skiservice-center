import jsQR from "jsqr";

export type QrTreffer =
    | { art: "service"; id: number; skiId: number | null }
    | { art: "verleih"; id: number; materialId: number | null };

function zahl(wert: string | null | undefined): number | null {
    return wert && /^\d+$/.test(wert) ? Number(wert) : null;
}

/**
 * Wertet den Inhalt eines Etikett-QR-Codes aus, unabhängig vom Host:
 * .../skiservice/anzeigen/{id}?ski={skiId} oder .../saisonverleih/anzeigen/{id}?material={materialId}.
 * Andere Inhalte ergeben null.
 */
export function qrAuswerten(text: string): QrTreffer | null {
    let url: URL;
    try {
        url = new URL(text.trim());
    } catch {
        return null;
    }
    const treffer = url.pathname.match(/\/(skiservice|saisonverleih)\/anzeigen\/(\d+)\/?$/);
    if (!treffer) return null;
    const id = Number(treffer[2]);
    if (treffer[1] === "skiservice") {
        return { art: "service", id, skiId: zahl(url.searchParams.get("ski")) };
    }
    return { art: "verleih", id, materialId: zahl(url.searchParams.get("material")) };
}

// QR-Code im Bild suchen, große Bilder werden vorher verkleinert
export function qrAusCanvas(quelle: CanvasImageSource, breite: number, hoehe: number, canvas: HTMLCanvasElement, maxBreite: number, beideFarben = false): string | null {
    const faktor = Math.min(1, maxBreite / breite);
    canvas.width = Math.round(breite * faktor);
    canvas.height = Math.round(hoehe * faktor);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || canvas.width === 0 || canvas.height === 0) return null;
    ctx.drawImage(quelle, 0, 0, canvas.width, canvas.height);
    const bild = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(bild.data, bild.width, bild.height, { inversionAttempts: beideFarben ? "attemptBoth" : "dontInvert" });
    return code?.data ?? null;
}

// Foto aus der Kamera-App auswerten (funktioniert auch ohne HTTPS)
export async function qrAusDatei(datei: File): Promise<string | null> {
    const bitmap = await createImageBitmap(datei);
    try {
        const canvas = document.createElement("canvas");
        // Erst verkleinert (schnell), dann in voller Größe für kleine QR-Codes im Bild
        return qrAusCanvas(bitmap, bitmap.width, bitmap.height, canvas, 1280, true)
            ?? qrAusCanvas(bitmap, bitmap.width, bitmap.height, canvas, 2560, true);
    } finally {
        bitmap.close();
    }
}
