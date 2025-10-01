"use server";

import { kundenArraySchema, SkiSuchKunde } from "@/types/skikundentypes";
import { config } from "./config";

export async function kundeSuchen(previousState: unknown,formdata: SkiSuchKunde) {
    try {
        // const vorname = formdata.get("Vorname")?.toString() || "";
        // const nachname = formdata.get("Nachname")?.toString() || "";
        const vorname = formdata.Vorname || "";
        const nachname = formdata.Nachname || "";
        const response = await fetch(`${config.backendUrl}/api/v1/kunden/suchen?vorname=${vorname}&nachname=${nachname}`, { cache: "no-store" });
        if (!response.ok) {
            console.error("Fehler beim Suchen:", response);
            // return "error";
            return { success: false, error: "Fehler beim Suchen", data: null };
        }
        const data = await response.json();
        const parsedData = kundenArraySchema.safeParse(data);
        if (!parsedData.success) {
            console.error("Validierungsfehler:", parsedData.error);
            // return "validation error";
        }
        return parsedData;

    } catch (error) {
        console.error("Fehler beim Suchen:", error);
        // return "error";
        return { success: false, error: "Fehler beim Suchen - " + error, data: null };
    }
}