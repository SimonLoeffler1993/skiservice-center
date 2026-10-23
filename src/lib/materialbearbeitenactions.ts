"use server"

// Material bearbeiten, ausmustern und löschen. Ski, Schuh und Stock laufen über dieselben Funktionen.

import { z } from "zod";

import { anfrage, LoeschenSchema } from "./apianfrage";
import { ApiAntwort } from "@/types/actiontypes";
import {
    ArtSchema, HerstellerSchema, ModellSchema, SchuhModellSchema, SchuhSchema, SkistockSchema, SkiAenderungSchema,
    StammdatenVerwendung, StammdatenVerwendungSchema, VerleihVerwendung, VerleihVerwendungListeSchema,
} from "@/types/materialtypes";

// --- Ski, Schuh, Stock ---

const MATERIAL_PFAD = {
    ski: "/material/ski/eigen",
    schuh: "/material/schuh/eigen",
    stock: "/material/stock",
} as const;
export type MaterialArt = keyof typeof MATERIAL_PFAD;

const AusgemustertSchema = z.object({ Ausgemustert: z.boolean() });

export async function getMaterialVerwendung(art: MaterialArt, id: number): Promise<ApiAntwort<VerleihVerwendung[]>> {
    return anfrage(`${MATERIAL_PFAD[art]}/${id}/verwendung`, "GET", VerleihVerwendungListeSchema, "Verwendung konnte nicht geladen werden.");
}

export async function setMaterialAusgemustert(art: MaterialArt, id: number, ausgemustert: boolean): Promise<ApiAntwort<{ Ausgemustert: boolean }>> {
    return anfrage(`${MATERIAL_PFAD[art]}/${id}/ausgemustert`, "PATCH", AusgemustertSchema, "Konnte nicht geändert werden.", { Ausgemustert: ausgemustert });
}

export async function loescheMaterial(art: MaterialArt, id: number): Promise<ApiAntwort<{ success: boolean }>> {
    return anfrage(`${MATERIAL_PFAD[art]}/${id}`, "DELETE", LoeschenSchema, "Konnte nicht gelöscht werden.");
}

export type SkiAenderung = { Modell_ID?: number; SkiNr?: string; Laenge?: number; Saison?: string; EK?: number; VK?: number };
export async function aendereSkiMaterial(id: number, daten: SkiAenderung): Promise<ApiAntwort<z.infer<typeof SkiAenderungSchema>>> {
    return anfrage(`${MATERIAL_PFAD.ski}/${id}`, "PATCH", SkiAenderungSchema, "Ski konnte nicht geändert werden.", daten);
}

export type SchuhAenderung = { Modell_ID?: number; SchuhNr?: string; Groese?: number; Sohle?: number | null; Saison?: string; EK?: number; VK?: number };
export async function aendereSchuhMaterial(id: number, daten: SchuhAenderung): Promise<ApiAntwort<z.infer<typeof SchuhSchema>>> {
    return anfrage(`${MATERIAL_PFAD.schuh}/${id}`, "PATCH", SchuhSchema, "Schuh konnte nicht geändert werden.", daten);
}

export async function aendereStockMaterial(id: number, bezeichnung: string): Promise<ApiAntwort<z.infer<typeof SkistockSchema>>> {
    return anfrage(`${MATERIAL_PFAD.stock}/${id}`, "PATCH", SkistockSchema, "Stock konnte nicht geändert werden.", { Bezeichnung: bezeichnung });
}

// --- Hersteller und Modelle ---

const STAMM_PFAD = {
    skiart: "/material/ski/art",
    skihersteller: "/material/ski/hersteller",
    skimodell: "/material/ski/modell",
    schuhhersteller: "/material/schuh/hersteller",
    schuhmodell: "/material/schuh/modell",
} as const;
export type StammdatenArt = keyof typeof STAMM_PFAD;

export async function getStammdatenVerwendung(art: StammdatenArt, id: number): Promise<ApiAntwort<StammdatenVerwendung>> {
    return anfrage(`${STAMM_PFAD[art]}/${id}/verwendung`, "GET", StammdatenVerwendungSchema, "Verwendung konnte nicht geladen werden.");
}

export async function loescheStammdaten(art: StammdatenArt, id: number): Promise<ApiAntwort<{ success: boolean }>> {
    return anfrage(`${STAMM_PFAD[art]}/${id}`, "DELETE", LoeschenSchema, "Konnte nicht gelöscht werden.");
}

export async function aendereHersteller(art: "skihersteller" | "schuhhersteller", id: number, name: string): Promise<ApiAntwort<z.infer<typeof HerstellerSchema>>> {
    return anfrage(`${STAMM_PFAD[art]}/${id}`, "PATCH", HerstellerSchema, "Hersteller konnte nicht geändert werden.", { Name: name });
}

export async function aendereSkiModell(id: number, daten: { Modell?: string; Art_ID?: number; Hersteller_ID?: number }): Promise<ApiAntwort<z.infer<typeof ModellSchema>>> {
    return anfrage(`${STAMM_PFAD.skimodell}/${id}`, "PATCH", ModellSchema, "Modell konnte nicht geändert werden.", daten);
}

export async function aendereSchuhModell(id: number, daten: { Modell?: string; Jugend?: boolean; Hersteller_ID?: number }): Promise<ApiAntwort<z.infer<typeof SchuhModellSchema>>> {
    return anfrage(`${STAMM_PFAD.schuhmodell}/${id}`, "PATCH", SchuhModellSchema, "Modell konnte nicht geändert werden.", daten);
}

// --- Skiarten ---

export async function createSkiArt(art: string): Promise<ApiAntwort<z.infer<typeof ArtSchema>>> {
    return anfrage(STAMM_PFAD.skiart, "POST", ArtSchema, "Skiart konnte nicht angelegt werden.", { Art: art });
}

export async function aendereSkiArt(id: number, art: string): Promise<ApiAntwort<z.infer<typeof ArtSchema>>> {
    return anfrage(`${STAMM_PFAD.skiart}/${id}`, "PATCH", ArtSchema, "Skiart konnte nicht geändert werden.", { Art: art });
}
