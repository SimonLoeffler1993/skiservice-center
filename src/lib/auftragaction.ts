"use server";
import { config } from "./config";
import { AuftragListe, AuftragListeSchema, AuftragSchema, type SkiserviceEintrag } from "@/types/skiservicetypes";

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

        const formatDate = (date: Date): string =>
            date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })

        const body = JSON.stringify({
            kunden_id: kundeId,
            abhol_date: fertigBis ? formatDate(fertigBis) : null,
            skis: skiserviceEintraege,
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
        const data = AuftragSchema.parse(await response.json());
        // const serviceData = AuftragSchema.check(data)

        // console.log(data)

        return { success: true, error: null, data };

    } catch (error) {
        console.error("Fehler beim Anlegen des Auftrags:", error);
        return { success: false, error: "Fehler beim Anlegen des Auftrags - " + error, data: null };
    }
}

export async function getAuftragLesen(auftragID: number) {
    try {
        const res = await fetch(`${config.backendUrl}/api/v1/skiservice/auftrag/${auftragID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            console.error("Fehler beim Anlegen des Auftrags:", res);
            return { success: false, error: "Fehler beim Anlegen des Auftrags", data: null };
        }

        const data = AuftragSchema.parse(await res.json())

        return { success: true, error: null, data };

    } catch (error) {
        console.error("Fehler beim Anlegen des Auftrags:", error);
        return { success: false, error: "Fehler beim Anlegen des Auftrags - " + error, data: null };
    };

}

export async function setBindungChecked(skiIds:number[]) {
    try{
        const body = JSON.stringify({
            ski_ids: skiIds
        })
        const res = await fetch(`${config.backendUrl}/api/v1/skiservice/bindungfertig`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body
        });

        if (!res.ok) {
            console.log("Fehler beim BindungsCheck Response", res)
            return false
        }

        return true
    } catch (error) {
        console.error("Fehler beim BindungsCheck: ", error)
        return false
    }
}

// Skiservice Aufträge Laden
export async function getSkiserviceListe(limit: number = 25, letzteID?: number, saisonID?: number): Promise<AuftragListe | null>{

    let url = `${config.backendUrl}/api/v1/saisonverleih/?limit=${limit}`;
    if (saisonID) {
        url = `${config.backendUrl}/api/v1/saisonverleih/?saisonID=${saisonID}&limit=${limit}`;
    }

    if (letzteID) {
        url += `&last_id=${letzteID}`;
    }

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error("Fehler beim Laden Skiservices; ", res.status, res.statusText);
            return null;
        }

        return AuftragListeSchema.parse(await res.json())

    } catch (e) {
        console.error("Unerwarteter Fehler beim Laden der Skiservice Aufträge: ", e);
        return null;
    }
}