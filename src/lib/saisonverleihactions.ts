"use server"



import { ApiAntwort } from "@/types/actiontypes";
import { config } from "./config";
import { 
    SaisonVerleihCreate, SaisonVerleihCreateResponse, SaisonVerleihCreateResponseSchema,
    SaisonverleihReadSchema, SaisonverleihRead, SaisonverleihReadListSchema, SaisonverleihReadList, 
    SaisonVerleihNamenEttiketResponseSchema, SaisonVerleihNamenEttiketResponse,
    VerleihBelegung, VerleihBelegungListeSchema, VerleihArt,
    VerleihEtikett, VerleihEtikettListeSchema } from "@/types/saisonverleihtypes";
import { toApiAntwort } from "./helfer";
import { anfrage } from "./apianfrage";
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

export async function createSaisonVerleih(previousState: unknown,saisonVerleih: SaisonVerleihCreate): Promise<SaisonVerleihCreateResponse> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/neu`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(saisonVerleih),
        });
        if (!response.ok) {
            console.error("Fehler beim Erstellen:", response.status);
            return { success: false, error: "Saisonverleih konnte nicht gespeichert werden." };
        }
        const parsed = SaisonVerleihCreateResponseSchema.safeParse(await response.json());
        if (!parsed.success) {
            return { success: false, error: "Ungültige Antwort vom Server." };
        }
        return parsed.data;
    } catch (error) {
        console.error("Netzwerkfehler beim Erstellen:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
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
// art: nur Saison- oder nur Tagesverleihe, ohne Angabe alle
export async function getSaisonVerleihList(limit: number = 15, letzteID?: number, saisonID?: number, art?: VerleihArt): Promise<SaisonverleihReadList | null> {

    let url = `${config.backendUrl}/api/v1/saisonverleih/?limit=${limit}`;
    if (saisonID) {
        url = `${config.backendUrl}/api/v1/saisonverleih/?saisonID=${saisonID}&limit=${limit}`;
    }

    if (letzteID) {
        url += `&last_id=${letzteID}`;
    }
    if (art) {
        url += `&art=${art}`;
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



// Prüft, ob Ski oder Schuh im Zeitraum (JJJJ-MM-TT) bereits verliehen sind. Leere Liste = frei.
export async function getBelegung(
    von: string,
    bis: string,
    material: { skinr?: string; schuhnr?: number },
    ausserId?: number,
): Promise<ApiAntwort<VerleihBelegung[]>> {
    const parameter = new URLSearchParams({ von, bis });
    if (material.skinr) parameter.set("skinr", material.skinr);
    if (material.schuhnr !== undefined) parameter.set("schuhnr", String(material.schuhnr));
    if (ausserId !== undefined) parameter.set("ausser_id", String(ausserId));
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/belegung?${parameter}`, { cache: "no-store" });
        if (!response.ok) {
            return { success: false, error: "Belegung konnte nicht geprüft werden." };
        }
        return toApiAntwort(VerleihBelegungListeSchema.safeParse(await response.json()), "Ungültige Antwort bei der Belegungsprüfung.");
    } catch (error) {
        console.error("Belegungsprüfung fehlgeschlagen:", error);
        return { success: false, error: "Server nicht erreichbar. Belegung konnte nicht geprüft werden." };
    }
}


// Etiketten eines Verleihs: je Leihski und je Leihschuh eines
export async function getVerleihEtiketten(verleihId: number): Promise<VerleihEtikett[]> {
    const antwort = await anfrage(`/ettiket/verleih/${verleihId}`, "GET", VerleihEtikettListeSchema, "Etiketten konnten nicht geladen werden.");
    if (!antwort.success) throw new Error(antwort.error);
    return antwort.data;
}

// Druckt die gewählten Etiketten, gibt die Meldung der API zurück
export async function druckeVerleihEtiketten(verleihId: number, etiketten: string[]): Promise<ApiAntwort<string>> {
    const antwort = await anfrage(`/ettiket/verleih/${verleihId}`, "POST", SaisonVerleihNamenEttiketResponseSchema, "Etiketten konnten nicht gedruckt werden.", { etiketten });
    if (!antwort.success) return antwort;
    return antwort.data.success
        ? { success: true, data: antwort.data.message ?? "Gedruckt." }
        : { success: false, error: antwort.data.message ?? "Etiketten konnten nicht gedruckt werden." };
}
