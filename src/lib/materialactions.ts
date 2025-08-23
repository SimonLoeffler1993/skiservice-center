"use server"

import { config } from "@/lib/config";
import { SkiArraySchema } from "@/types/materialtypes";

export async function getSkiNrCheck(previousState: unknown,skiNr: string) {
    const response = await fetch(`${config.backendUrl}/api/v1/material/ski/eigen?skinr=${skiNr}`);
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