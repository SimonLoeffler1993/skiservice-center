"use server"

import { config } from "@/lib/config";
import { SkiArraySchema, SkiCreate, SkiArray,
    SchuhSchema, SkistockArraySchema, SkistockArray,
    SkiSchema, 
    SkiHerstellerArraySchema, SkiHerstellerArray, HerstellerSchema,
    SkiArtArraySchema, SkiArtArray, 
    ModellSchema, ModellArraySchema, ModellArray, SkiModellCreate } from "@/types/materialtypes";

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
    // TODO: Validierung auf das richtige schema
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

export async function getSkiStoecke(): Promise<SkistockArray> {
    const response = await fetch(`${config.backendUrl}/api/v1/material/stock/skistocke`, { cache: "no-store" });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const data = await response.json();
    const parsedData = SkistockArraySchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
}

// Ski Hersteller
export async function getSkiHersteller(): Promise<SkiHerstellerArray> {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/hersteller`, { cache: "no-store" });
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

export async function createSkiHersteller(previousState: unknown,name: string) {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/hersteller`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "Name":name }),
    });
    if (!response.ok) {
        console.error("Fehler beim Suchen:", response);
        return [];
    }
    const data = await response.json();
    const parsedData = HerstellerSchema.safeParse(data);
    if (!parsedData.success) {
        console.error("Validierungsfehler:", parsedData.error);
        return [];
    }
    // Ensure we always return the correct structure
    return parsedData.data || [];
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
