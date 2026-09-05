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

    // SKI
export async function getSkiNrCheck(previousState: unknown,skiNr: string) {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/eigen?skinr=${skiNr}`, { cache: "no-store" });
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
        console.error("Skis nicht gefunden");
        return { success: false, error: "Ski nicht gefunden", data: null };
    }
    
    return { success: true, error: null, data: parsedData.data };
}

export async function getSkiList(): Promise<SkiArray> {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/liste`, { cache: "no-store" });
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

export async function getSchuhNrCheck(previousState: unknown,schuhNr: string) {
    const response = await fetch(`${config.backendUrl}/api/v1/material/schuh/eigen?schuhnr=${schuhNr}`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return { success: false, error: "Fehler beim Suchen", data: null };
    }
    const data = await response.json();

    const parsedData = SchuhSchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return { success: false, error: "Validierungsfehler", data: null };
    }

    if (parsedData.data == undefined) {
        console.error("Schuh nicht gefunden");
        return { success: false, error: "Schuh nicht gefunden", data: null };
    }
    
    return { success: true, error: null, data: parsedData.data };
}

export async function getSkiStoecke(): Promise<ApiAntwort<SkistockArray>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/material/stock/skistocke`, { cache: "no-store" });
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
export async function createSkiModell(previousState: unknown,data: SkiModellCreate) {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/modell`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const responseData = await response.json();
    const parsedData = ModellSchema.safeParse(responseData);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
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
export async function createSki(previousState: unknown,data: SkiCreate) {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/anlegen`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const responseData = await response.json();
    const parsedData = SkiSchema.safeParse(responseData);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
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
        const response = await fetch(`${config.backendUrl}/api/v1/material/schuh/eigen/liste`);

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