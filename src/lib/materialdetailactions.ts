"use server";

import { anfrage, LoeschenSchema } from "./apianfrage";
import { ApiAntwort } from "@/types/actiontypes";
import {
    SchuhDetails, SchuhDetailsSchema, SkiDetails, SkiDetailsSchema, SkiService, SkiServiceEingabe, SkiServiceSchema,
} from "@/types/materialdetailtypes";

// Ski mit jeder Verleihzeile, seinen Services und dem Erwirtschafteten
export async function holeSkiDetails(id: number): Promise<ApiAntwort<SkiDetails>> {
    return anfrage(`/material/ski/eigen/${id}/details`, "GET", SkiDetailsSchema, "Ski konnte nicht geladen werden.");
}

export async function holeSchuhDetails(id: number): Promise<ApiAntwort<SchuhDetails>> {
    return anfrage(`/material/schuh/eigen/${id}/details`, "GET", SchuhDetailsSchema, "Schuh konnte nicht geladen werden.");
}

export async function erstelleSkiService(skiID: number, daten: SkiServiceEingabe): Promise<ApiAntwort<SkiService>> {
    return anfrage(`/material/ski/eigen/${skiID}/service`, "POST", SkiServiceSchema, "Service konnte nicht eingetragen werden.", daten);
}

export async function aendereSkiService(serviceID: number, daten: SkiServiceEingabe): Promise<ApiAntwort<SkiService>> {
    return anfrage(`/material/ski/service/${serviceID}`, "PATCH", SkiServiceSchema, "Service konnte nicht geändert werden.", daten);
}

export async function loescheSkiService(serviceID: number): Promise<ApiAntwort<{ success: boolean }>> {
    return anfrage(`/material/ski/service/${serviceID}`, "DELETE", LoeschenSchema, "Service konnte nicht gelöscht werden.");
}
