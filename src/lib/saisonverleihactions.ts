"use server"



import { config } from "./config";
import { 
    SaisonverleihPreise, SaisonVerleihCreate, SaisonVerleihCreateResponse, 
    SaisonverleihReadSchema, SaisonverleihRead, SaisonverleihReadListSchema, SaisonverleihReadList, 
    SaisonVerleihNamenEttiketResponseSchema, SaisonVerleihNamenEttiketResponse } from "@/types/saisonverleihtypes";

export async function getSaisonVerleihPreis(): Promise<SaisonverleihPreise> {
    // TODO: Validierung auf das richtige schema
    const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/preise`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return { preise: [] };
    }
    const data = await response.json();
    // Ensure we always return the correct structure
    return data || { preise: [] };
}

export async function createSaisonVerleih(previousState: unknown,saisonVerleih: SaisonVerleihCreate): Promise<SaisonVerleihCreateResponse | null> {
    // console.log("Erstellen:", saisonVerleih);
    
    const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/neu`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(saisonVerleih),
    });
    if (!response.ok) {
        console.error("Fehler beim Erstellen:", response);
        return null;
    }
    const data = await response.json();
    // Ensure we always return the correct structure
    return data || null;
}

// Ein SaisonVerleih per ID laden
export async function getSaisonVerleihById(id: number | string): Promise<SaisonverleihRead | null> {
    try {
        const res = await fetch(`${config.backendUrl}/api/v1/saisonverleih/${id}`, { cache: "no-store" });
        if (!res.ok) {
            console.error("Fehler beimLaden SaisonVerleih:", id, res.status, res.statusText);
            return null;
        }
        const json = await res.json();
 
        const candidate = json?.data ?? json;
        const parsed = SaisonverleihReadSchema.safeParse(candidate);
        if (!parsed.success) {
            console.error("Ungültige Antwortstruktur für SaisonVerleih", parsed.error.flatten());
            return null;
        }
    
        return parsed.data;
    } catch (e) {
        console.error("Unerwarteter Fehler beimLaden SaisonVerleih:", e);
        return null;
    }
}

// SaisonVerleihliste laden
export async function getSaisonVerleihList(saisonID?: number): Promise<SaisonverleihReadList | null> {

    let url = `${config.backendUrl}/api/v1/saisonverleih/`;
    if (saisonID) {
        url = `${config.backendUrl}/api/v1/saisonverleih/?saisonID=${saisonID}`;
    }
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
            console.error("Fehler beimLaden SaisonVerleih:", res.status, res.statusText);
            return null;
        }
        const json = await res.json();
 
        const candidate = json?.data ?? json;
        const parsed = SaisonverleihReadListSchema.safeParse(candidate);
        if (!parsed.success) {
            console.error("Ungültige Antwortstruktur für SaisonVerleih", parsed.error.flatten());
            return null;
        }
    
        return parsed.data;
    } catch (e) {
        console.error("Unerwarteter Fehler beimLaden SaisonVerleih:", e);
        return null;
    }
}

// PDF generieren
export async function getSaisonVerleihPDF(previousState: unknown,id: number): Promise<Blob | null> {
    try {
        const res = await fetch(`${config.backendUrl}/api/v1/saisonverleih/pdf/${id}`, { cache: "no-store" });
        if (!res.ok) {
            console.error("Fehler beimLaden SaisonVerleih:", id, res.status, res.statusText);
            return null;
        }
        const blob = await res.blob();
        return blob;
    } catch (e) {
        console.error("Unerwarteter Fehler beimLaden SaisonVerleih:", e);
        return null;
    }
}

// Namen Ettiket generieren
export async function getSaisonVerleihNamenEttiket(previousState: unknown,id: number): Promise<SaisonVerleihNamenEttiketResponse | null> {
    try {
        const res = await fetch(`${config.backendUrl}/api/v1/ettiket/saisonfahrer/${id}`, { cache: "no-store" });
        if (!res.ok) {
            console.error("Fehler beimLaden Namen Ettiket:", id, res.status, res.statusText);
            return null;
        }
        const json = await res.json();
        const candidate = json?.data ?? json;
        const parsed = SaisonVerleihNamenEttiketResponseSchema.safeParse(candidate);
        if (!parsed.success) {
            console.error("Ungültige Antwortstruktur für Namen Ettiket", parsed.error.flatten());
            return null;
        }
        return parsed.data;
    } catch (e) {
        console.error("Unerwarteter Fehler beimLaden Namen Ettiket:", e);
        return null;
    }
}

