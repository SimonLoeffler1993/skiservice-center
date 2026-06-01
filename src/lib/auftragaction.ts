import { config } from "./config";

export async function auftragFertigStellen(serviceId: number, skiIds: number[]) {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/skiservice/skifertig`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: serviceId, ski_ids: skiIds }),
        });
        if (!response.ok) {
            console.error("Fehler beim Fertigstellen:", response);
            return { success: false, error: "Fehler beim Fertigstellen", data: null };
        }
        const data = await response.json();
        return { success: true, error: null, data };

    } catch (error) {
        console.error("Fehler beim Fertigstellen:", error);
        return { success: false, error: "Fehler beim Fertigstellen - " + error, data: null };
    }
}