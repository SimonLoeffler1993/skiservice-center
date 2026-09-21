"use server"



import { ApiAntwort } from "@/types/actiontypes";
import { config } from "./config";
import { 
    SaisonVerleihCreate, SaisonVerleihCreateResponse, 
    SaisonverleihReadSchema, SaisonverleihRead, SaisonverleihReadListSchema, SaisonverleihReadList, 
    SaisonVerleihNamenEttiketResponseSchema, SaisonVerleihNamenEttiketResponse } from "@/types/saisonverleihtypes";
import { toApiAntwort } from "./helfer";
import { SaisonverleihPreiseListe, saisonverleihPreiseListeSchema } from "@/types/saisonverleihpreisetypes";

export async function getSaisonVerleihPreis(): Promise<ApiAntwort<SaisonverleihPreiseListe>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/preise`);
        if (!response.ok) {
            console.error("Fehler beim Suchen:", response);
            return { success: false, error: "Fehler beim Suchen" };
        }
        const data = await response.json();
        const parsed = saisonverleihPreiseListeSchema.safeParse(data);

        if (!parsed.success) {
            console.error("Ungültige Antwortstruktur für Saisonverleih-Preise", parsed.error.flatten());
            return { success: false, error: "Ungültige Antwortstruktur für Saisonverleih-Preise" };
        }

        return toApiAntwort(parsed ,"Antowrt vom Server war nicht wie erwartet, beim Saisonverleih-Preise laden");
    } catch (error) {
        console.error("Fehler beim Laden der Saisonverleih-Preise:", error);
        return { success: false, error: "Fehler beim Laden der Saisonverleih-Preise" };
    }
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
        const res = await fetch(`${config.backendUrl}/api/v1/saisonverleih/${id}`);
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
export async function getSaisonVerleihList(limit: number = 15, letzteID?: number, saisonID?: number): Promise<SaisonverleihReadList | null> {

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
        const res = await fetch(`${config.backendUrl}/api/v1/saisonverleih/pdf/${id}`);
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
        const res = await fetch(`${config.backendUrl}/api/v1/ettiket/saisonfahrer/${id}`);
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

// Saisonverleih auf zurückgegeben setzen
export async function setSaisonVerleihZurueckgegeben(previousState: unknown,id: number): Promise<boolean> {
    try {
        const res = await fetch(`${config.backendUrl}/api/v1/saisonverleih/zurueckgeben/${id}`, { method: "POST"});
        if (!res.ok) {
            console.error("Fehler beimSetzen SaisonVerleih auf zurückgegeben:", id, res.status, res.statusText);
            return false;
        }
        return true;
    } catch (e) {
        console.error("Unerwarteter Fehler beimSetzen SaisonVerleih auf zurückgegeben:", e);
        return false;
    }
}

