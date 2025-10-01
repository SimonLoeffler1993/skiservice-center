"use server";

import { terminalSchema } from "@/types/skiterminaltypes";
import { config } from "./config";

export async function kundeTerminaAbfragen() {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/event/terminals`, { cache: "no-store" });
        if (!response.ok) {
            console.error("Fehler beim Suchen:", response);
            // return "error";
            return null;
        }
        const data = await response.json();
        // TODO: Validierung auf das richtige schema
        const parsedData = terminalSchema.safeParse(data);
        if (!parsedData.success) {
            console.error("Validierungsfehler:", parsedData.error);
            // return "validation error";
            return null;
        }
        return parsedData.data || null;

    } catch (error) {
        console.error("Fehler beim Suchen:", error);
        // return "error";
        return null;
    }
    
}

export async function kundeTerminalSenden(terminal: string, kunde_id: number) {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/event/zeigekunde`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                terminal,
                kunde_id
            }),
        });
        if (!response.ok) {
            console.error("Fehler beim Senden:", response);
            // return "error";
            return null;
        }
        const data = await response.json();
        const parsedData = terminalSchema.safeParse(data);
        if (!parsedData.success) {
            console.error("Validierungsfehler:", parsedData.error);
            // return "validation error";
            return null;
        }
        return parsedData.data || null;

    } catch (error) {
        console.error("Fehler beim Senden:", error);
        // return "error";
        return null;
    }
    
}

