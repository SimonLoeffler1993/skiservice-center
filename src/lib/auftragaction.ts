"use server";
import { apiFetch } from "@/lib/apianfrage";
import { config } from "./config";
import { AuftragListe, AuftragListeSchema, AuftragSchema, ServiceListenFilter } from "@/types/skiservicetypes";
import { ListenSortierung } from "@/types/liste";
import { MailStatus, MailStatusSchema } from "@/types/skiscanner";
import type { Bindungsdaten } from "@/types/bindungsdatentypes";

// Ski wie ihn die API beim Anlegen erwartet
export type SkiAnlegen = {
    service: string;
    preis: number;
    bindung_check: boolean;
    bindung_preis: number;
    bindungsdaten: Bindungsdaten | null;
    vorlage_id: number | null;
};

type FertigAntwort =
    // mail: Ergebnis der Fertig-Mail, null wenn keine fällig war
    | { success: true; error: null; data: unknown; mail: MailStatus | null }
    | { success: false; error: string; data: null; mail: null };

// mail = false: keine Fertig-Mail, auch wenn danach alle Ski fertig sind
export async function auftragFertigStellen(serviceId: number, skiIds: number[], mail = true): Promise<FertigAntwort> {
    try {
        const response = await apiFetch(`${config.backendUrl}/api/v1/skiservice/skifertig`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: serviceId, ski_ids: skiIds, mail }),
        });
        if (!response.ok) {
            console.error("Fehler beim Fertigstellen:", response);
            return { success: false, error: "Fehler beim Fertigstellen", data: null, mail: null };
        }
        const data = await response.json();
        return { success: true, error: null, data, mail: MailStatusSchema.safeParse(data?.mail).data ?? null };

    } catch (error) {
        console.error("Fehler beim Fertigstellen:", error);
        return { success: false, error: "Fehler beim Fertigstellen - " + error, data: null, mail: null };
    }
}

// fertigBis kommt bereits als "TT.MM.JJJJ" aus dem Browser
export async function auftragAnlegen(kundeId: number, skiserviceEintraege: SkiAnlegen[], fertigBis: string | null) {
    try {
        const body = JSON.stringify({
            kunden_id: kundeId,
            abhol_date: fertigBis,
            skis: skiserviceEintraege,
        })

        const response = await apiFetch(`${config.backendUrl}/api/v1/skiservice/neu`, {
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
        const res = await apiFetch(`${config.backendUrl}/api/v1/skiservice/auftrag/${auftragID}`, {
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

// Ergebnis der Bindungsprüfung, mail = Fertig-Mail, falls sie dadurch fällig wurde (Einstellung "Service + Bindung")
export async function setBindungChecked(skiIds:number[]): Promise<{ ok: boolean; mail: MailStatus | null }> {
    try{
        const body = JSON.stringify({
            ski_ids: skiIds
        })
        const res = await apiFetch(`${config.backendUrl}/api/v1/skiservice/bindungfertig`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body
        });

        if (!res.ok) {
            console.log("Fehler beim BindungsCheck Response", res)
            return { ok: false, mail: null }
        }

        const antwort = await res.json().catch(() => null);
        const mail = MailStatusSchema.safeParse(antwort?.mail);
        return { ok: true, mail: mail.success ? mail.data : null }
    } catch (error) {
        console.error("Fehler beim BindungsCheck: ", error)
        return { ok: false, mail: null }
    }
}

// Skiservice Aufträge Laden
export async function getSkiserviceListe(limit: number = 25, letzteID?: number, saisonID?: number, sortierung?: ListenSortierung, suche?: string, filter: ServiceListenFilter = {}): Promise<AuftragListe | null>{

    let url = `${config.backendUrl}/api/v1/skiservice/?limit=${limit}`;
    if (saisonID) {
        url = `${config.backendUrl}/api/v1/skiservice/?saisonID=${saisonID}&limit=${limit}`;
    }

    if (letzteID) {
        url += `&last_id=${letzteID}`;
    }
    if (sortierung) {
        url += `&sortierung=${sortierung}`;
    }
    if (suche) {
        url += `&suche=${encodeURIComponent(suche)}`;
    }
    for (const [name, wert] of Object.entries(filter)) {
        if (wert) url += `&${name}=${encodeURIComponent(wert)}`;
    }

    try {
        const res = await apiFetch(url);
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

export async function skiEttikettenDrucken(ettiketenData: FormData) {
    const skiIDs = ettiketenData.getAll("skiIds").map(id => Number(id));
    console.log("Ettiketen drucken für Skis:", skiIDs);
    try {
        const response = await apiFetch(`${config.backendUrl}/api/v1/ettiket/serviceskis`, {
            method: "POST",
            body: JSON.stringify({ ski_ids: skiIDs }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Fehler beim Drucken der Ettiketen:", response);
            return { success: false, error: "Fehler beim Drucken der Ettiketen", data: null };
        }

        const data = await response.json();
        return { success: true, error: null, data };

    } catch (error) {
        console.error("Fehler beim Drucken der Ettiketen:", error);
        return { success: false, error: "Fehler beim Drucken der Ettiketen - " + error, data: null };
    }
}