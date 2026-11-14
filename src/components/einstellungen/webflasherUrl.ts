// Modi der Hardware-Scanner, müssen zu TriggerStatus der API und zur Firmware passen
export const SCANNER_MODI: Record<number, string> = {
    0: "Bearbeitung",
    1: "Fertigstellen",
    2: "Bindung prüfen",
};

export type WebflasherEinrichtung = {
    server: string;
    name: string;
    modus: number;
};

// Adresse des Webflashers mit vorbelegter Einrichtung. Die Werte stehen hinter #,
// damit sie nicht an den Webserver des Webflashers gesendet werden.
export function webflasherUrl(basis: string, einrichtung: WebflasherEinrichtung): string {
    const parameter = new URLSearchParams();
    if (einrichtung.server.trim()) parameter.set("server", einrichtung.server.trim());
    if (einrichtung.name.trim()) parameter.set("name", einrichtung.name.trim());
    parameter.set("modus", String(einrichtung.modus));
    return `${basis.trim().replace(/#.*$/, "")}#${parameter.toString()}`;
}
