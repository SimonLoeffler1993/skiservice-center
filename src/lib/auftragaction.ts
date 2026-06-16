"use server";
import { config } from "./config";
import { type SkiserviceEintrag } from "@/types/skiservicetypes";

// TODO: backend URL richtig lesen

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

export async function auftragAnlegen(kundeId: number, skiserviceEintraege: SkiserviceEintrag[], fertigBis: Date | null) {
    try {

        const body = JSON.stringify({
            kunden_id: kundeId,
            abhol_date: fertigBis?.toISOString() ?? null,
            skis: skiserviceEintraege.map(e => ({
                service: e.service,
                preis: String(e.preis),
                bindung_preis: e.bindung ? /* Preis hier */ 0 : 0,
            })),
        })

        console.log(body)

        const response = await fetch(`${config.backendUrl}/api/v1/skiservice/neu`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body
        });
        if (!response.ok) {
            console.error("Fehler beim Anlegen des Auftrags:", response);
            return { success: false, error: "Fehler beim Anlegen des Auftrags", data: null };
        }
        const data = await response.json();
        return { success: true, error: null, data };

    } catch (error) {
        console.error("Fehler beim Anlegen des Auftrags:", error);
        return { success: false, error: "Fehler beim Anlegen des Auftrags - " + error, data: null };
    }
}