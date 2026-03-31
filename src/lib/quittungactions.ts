import { config } from "./config";

export async function getQuittung(quittungID: number) {
    const response = await fetch(`${config.backendUrl}/api/v1/quittungen/quittung/${quittungID}?bezahlinfo=true`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Abrufen der Quittung:", response);
        return null;
    }
    const data = await response.json();
    return data;
}