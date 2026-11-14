import { KundenSortierung } from "@/types/skikundentypes";

export type KundenAnsicht = {
    suche: string;
    sortierung: KundenSortierung;
    seite: number;
};

// Adresse der Kundenliste, Standardwerte werden weggelassen
export function kundenUrl({ suche, sortierung, seite }: KundenAnsicht): string {
    const parameter = new URLSearchParams();
    if (suche) parameter.set("suche", suche);
    if (sortierung !== "name") parameter.set("sortierung", sortierung);
    if (seite > 1) parameter.set("seite", String(seite));
    const text = parameter.toString();
    return text ? `/kunde?${text}` : "/kunde";
}
