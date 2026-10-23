"use server"

import { config } from "./config";
import { toApiAntwort } from "./helfer";
import { ApiAntwort } from "@/types/actiontypes";
import { BindungsdatenListeEintrag, BindungsdatenListeSchema, BindungsdatenReadSchema, BindungsdatenRead } from "@/types/bindungsdatentypes";

// Alle Bindungsdaten eines Kunden, neueste zuerst
export async function getBindungsdaten(kundeId: number, mitArchiv: boolean): Promise<ApiAntwort<BindungsdatenListeEintrag[]>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/kunden/${kundeId}/bindungsdaten?archiviert=${mitArchiv}`, { cache: "no-store" });
        if (!response.ok) {
            return { success: false, error: "Bindungsdaten konnten nicht geladen werden." };
        }
        return toApiAntwort(BindungsdatenListeSchema.safeParse(await response.json()), "Ungültige Antwort beim Laden der Bindungsdaten.");
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}

export async function setBindungsdatenArchiviert(id: number, archiviert: boolean): Promise<ApiAntwort<BindungsdatenRead>> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/bindungsdaten/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Archiviert: archiviert }),
        });
        if (!response.ok) {
            return { success: false, error: "Eintrag konnte nicht geändert werden." };
        }
        return toApiAntwort(BindungsdatenReadSchema.safeParse(await response.json()), "Ungültige Antwort vom Server.");
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return { success: false, error: "Server nicht erreichbar. Bitte später erneut versuchen." };
    }
}
