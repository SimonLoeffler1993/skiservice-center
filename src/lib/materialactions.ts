"use server"

import { config } from "@/lib/config";
import { ApiAntwort } from "@/types/actiontypes";
import { SkiArraySchema, SkiCreate, SkiArray,
    SchuhSchema, SkistockArraySchema, SkistockArray,
    SkiSchema, 
    SkiHerstellerArraySchema, SkiHerstellerArray, HerstellerSchema,
    SkiArtArraySchema, SkiArtArray, 
    ModellSchema, ModellArraySchema, ModellArray, SkiModellCreate, 
    Hersteller, SchuhModellSchema, SchuhModell, SchuhModellCreate,
    SchuhModellArraySchema, SchuhModellArray, 
    SchuhArray, Schuh, CreateSkiSchuh,
    SchuhArraySchema,
    SkistockSchema,
    Skistock,
    SkistockCreate} from "@/types/materialtypes";
import { toApiAntwort } from "./helfer";
import { z } from "zod";

    // SKI
export async function getSkiNrCheck(previousState: unknown,skiNr: string) {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/eigen?skinr=${encodeURIComponent(skiNr.trim())}`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return { success: false, error: "Fehler beim Suchen", data: null };
    }
    const data = await response.json();
    // TODO: Validierung auf das richtige schema
    const parsedData = SkiArraySchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return { success: false, error: "Validierungsfehler", data: null };
    }

    if (parsedData.data.length === 0) {
        return { success: false, error: "Ski nicht gefunden", data: null };
    }

    // Exakten Treffer bevorzugen, sonst den ersten Ski, der mit der Nummer beginnt
    const exakt = parsedData.data.find((ski) => ski.SkiNr.toLowerCase() === skiNr.trim().toLowerCase());
    const treffer = exakt ? [exakt, ...parsedData.data.filter((ski) => ski !== exakt)] : parsedData.data;
    if (treffer[0].Ausgemustert) {
        return { success: false, error: `Ski ${treffer[0].SkiNr} ist ausgemustert`, data: null };
    }

    return { success: true, error: null, data: treffer };
}

export async function getSkiList(): Promise<SkiArray> {
    // Materialverwaltung: auch ausgemusterte Ski laden, gefiltert wird im Center
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/liste?mit_ausgemustert=true`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const data = await response.json();
    const parsedData = SkiArraySchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
}

export async function getSchuhNrCheck(previousState: unknown, schuhNr: string) {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/schuh/eigen?schuhnr=${encodeURIComponent(schuhNr.trim())}`, { cache: "no-store" });
        if (response.status === 404) {
            return { success: false as const, error: "Schuh nicht gefunden", data: null };
        }
        if (!response.ok) {
            return { success: false as const, error: "Fehler beim Suchen", data: null };
        }
        const parsedData = SchuhSchema.safeParse(await response.json());
        if (!parsedData.success) {
            console.error("Validierungsfehler:", parsedData.error);
            return { success: false as const, error: "Validierungsfehler", data: null };
        }
        if (parsedData.data.Ausgemustert) {
            return { success: false as const, error: `Schuh ${parsedData.data.SchuhNr} ist ausgemustert`, data: null };
        }
        return { success: true as const, error: null, data: parsedData.data };
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return { success: false as const, error: "Server nicht erreichbar", data: null };
    }
}

// Ohne mitAusgemustert nur verleihbare Stöcke (Auswahl im Verleih)
export async function getSkiStoecke(mitAusgemustert: boolean = false): Promise<ApiAntwort<SkistockArray>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/stock/skistocke?mit_ausgemustert=${mitAusgemustert}`, { cache: "no-store" });
        if (!response.ok) {
            console.error("Fehler beim Suchen:", response);
            return { success: false, error: "Fehler beim Suchen"};
        }
        const data = await response.json();
        const parsedData = SkistockArraySchema.safeParse(data);
        
        return toApiAntwort(parsedData, "Antwort vom Server war ungültig beim abfragen der Ski-Stöcke");
    } catch (error) {
        console.error("Fehler beim Laden der Ski-Stöcke:", error);
        return { success: false, error: "Fehler beim Laden der Ski-Stöcke"};
    }
}

export async function createSkiStoeck(previousState: unknown, skistock: SkistockCreate): Promise<ApiAntwort<Skistock>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(skistock)
        });

        if (!response.ok) {
            console.error("Fehler beim Anlegen des Skistocks:", response.status);
            return { success: false, error: "Der Skistock konnte nicht angelegt werden." };
        }

        const data = await response.json();
        const parsedData = SkistockSchema.safeParse(data);

        return toApiAntwort(parsedData, "Antwort vom Server war ungültig beim Anlegen des Skistocks");
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}

// Ski und Schuhe Hersteller
export async function getSkiHersteller(schuh?: boolean): Promise<SkiHerstellerArray> {
    const herstellerEndpoint = schuh
        ? "/api/v1/material/schuh/hersteller"
        : "/api/v1/material/ski/hersteller";

    const response = await fetch(`${config.backendUrl}${herstellerEndpoint}`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const data = await response.json();
    const parsedData = SkiHerstellerArraySchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
}

// Wird auch zum Anlegen von Schuhherstellern verwendet, daher schuh?: boolean
export async function createSkiHersteller(
    previousState: unknown,
    payload: { name: string; schuh?: boolean }
): Promise<ApiAntwort<Hersteller>> {
    const { name, schuh } = payload;
    const herstellerEndpoint = schuh
        ? "/api/v1/material/schuh/hersteller"
        : "/api/v1/material/ski/hersteller";

    try {
        const response = await fetch(`${config.backendUrl}${herstellerEndpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Name: name }),
        });

        if (!response.ok) {
            console.error("Fehler beim Anlegen:", response.status);
            return { success: false, error: "Der Hersteller konnte nicht angelegt werden." };
        }

        const data = await response.json();
        const parsedData = HerstellerSchema.safeParse(data);

        if (!parsedData.success) {
            console.error("Validierungsfehler:", parsedData.error);
            return { success: false, error: "Antwort vom Server war ungültig." };
        }

        return { success: true, data: parsedData.data };
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}

// Ski Art
export async function getSkiArt(): Promise<SkiArtArray> {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/art`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const data = await response.json();
    const parsedData = SkiArtArraySchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
}

// TODO: Implementieren in UI
// export async function createSkiArt(previousState: unknown,name: string) {
//     const response = await fetch(`${config.backendUrl}/api/v1/material/ski/art`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ "Name":name }),
//     });
//     if (!response.ok) {
//         console.error("Fehler beim Suchen:", response);
//         return [];
//     }
//     const data = await response.json();
//     const parsedData = ArtSchema.safeParse(data);
//     if (!parsedData.success) {
//         console.error("Validierungsfehler:", parsedData.error);
//         return [];
//     }
//     // Ensure we always return the correct structure
//     return parsedData.data || [];
// }

// Ski Modell
export async function createSkiModell(previousState: unknown, data: SkiModellCreate): Promise<ApiAntwort<z.infer<typeof ModellSchema>>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/ski/modell`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            console.error("Fehler beim Speichern:", response.status);
            return { success: false, error: "Das Skimodell konnte nicht gespeichert werden." };
        }
        return toApiAntwort(ModellSchema.safeParse(await response.json()), "Ungültige Antwort vom Server.");
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}   

export async function getModell(): Promise<ModellArray> {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/modell`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const data = await response.json();
    const parsedData = ModellArraySchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
}

// Ski
export async function createSki(previousState: unknown, data: SkiCreate): Promise<ApiAntwort<z.infer<typeof SkiSchema>>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/ski/anlegen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            console.error("Fehler beim Speichern:", response.status);
            return { success: false, error: "Der Ski konnte nicht gespeichert werden." };
        }
        return toApiAntwort(SkiSchema.safeParse(await response.json()), "Ungültige Antwort vom Server.");
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}   

export async function getSchuhModelle(): Promise<ApiAntwort<SchuhModellArray>> {
    const response = await fetch(`${config.backendUrl}/api/v1/material/schuh/modelle`);
    
    if (!response.ok) {
        console.error("Fehler beim Abfragen der Schumodelle:", response.status);
        return { success: false, error: "Die Schumodelle konnten nicht geladen werden" };
    }

    try {
        const data = await response.json();
        const parsedData = SchuhModellArraySchema.safeParse(data);

        return toApiAntwort(parsedData,"Antwort vom Server war ungültig, beim Abfragen der Schuhmodelle!")
        // if (!parsedData.success) {
        //     console.error("Validierungsfehler:", parsedData.error);
        //     return { success: false, error: "Antwort vom Server war ungültig, beim Abfragen der Schuhmodelle!" };
        // }

        // return { success: true, data: parsedData.data };

    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}

export async function createSchuhModell(previousState: unknown,SchuhModell: SchuhModellCreate): Promise<ApiAntwort<SchuhModell>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/schuh/modell`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(SchuhModell)
        });
        
        if (!response.ok) {
            console.error("Fehler beim Abfragen der Schumodelle:", response.status);
            return { success: false, error: "Die Schumodelle konnten nicht geladen werden" };
        }

        const data = await response.json()
        const parsedData = SchuhModellSchema.safeParse(data)

        return toApiAntwort(parsedData, "Server hat beim erstellend des Schuhmodell nicht richtig geantwortet!")

    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}

export async function getSkiSchuhe(): Promise<ApiAntwort<SchuhArray>> {
    try {
        // Materialverwaltung: auch ausgemusterte Schuhe laden, gefiltert wird im Center
        const response = await fetch(`${config.backendUrl}/api/v1/material/schuh/eigen/liste?mit_ausgemustert=true`, { cache: "no-store" });

        if (!response.ok) {
            console.error("Fehler beim Abfragen der Schuhe:", response.status);
            return { success: false, error: "Die Schuhe konnten nicht geladen werden" };
        }

        const data = await response.json();
        const parsedData = SchuhArraySchema.safeParse(data)

        return toApiAntwort(parsedData, "Antwort vom Server war ungültig beim abfragen der Skischuhe")


    } catch (error) {
        console.error("Netzwerkfehler: beim Skischuhe abfragen - ", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}

export async function createSkiSchuh(previousState: unknown, skiSchuh: CreateSkiSchuh): Promise<ApiAntwort<Schuh>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/schuh/eigen`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(skiSchuh)
        });

        if (!response.ok) {
            console.error("Fehler beim Erstellen des Skischuhs:", response.status);
            return { success: false, error: "Der Skischuh konnte nicht erstellt werden" };
        }

        const data = await response.json();
        const parsedData = SchuhSchema.safeParse(data)

        return toApiAntwort(parsedData, "Antwort vom Server war ungültig beim erstellen des Skischuhs")
    
    } catch (error) {
        console.error("Netzwerkfehler: beim Skischuh erstellen - ", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }

}