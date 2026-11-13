import { z } from "zod";

// Das Dashboard hat zwei Ansichten, die Auswahl steht in der URL
export const WerkstattAnsichtSchema = z.enum(["service", "verleih"]);
export type WerkstattAnsicht = z.infer<typeof WerkstattAnsichtSchema>;

// Automatischer Wechsel: Dauer je Ansicht in Sekunden
export const STANDARD_SEKUNDEN = 20;
export const MIN_SEKUNDEN = 5;
export const MAX_SEKUNDEN = 600;

// Adresse des Dashboards, Standardwerte werden weggelassen
export function werkstattUrl(ansicht: WerkstattAnsicht, auto: boolean, sekunden: number): string {
    const parameter = new URLSearchParams();
    if (ansicht !== "service") parameter.set("ansicht", ansicht);
    if (auto) parameter.set("auto", "1");
    if (sekunden !== STANDARD_SEKUNDEN) parameter.set("sekunden", String(sekunden));
    const text = parameter.toString();
    return text ? `/werkstatt?${text}` : "/werkstatt";
}
