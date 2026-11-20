"use server"
import { config } from "@/lib/config";

/** ok = API und Datenbank erreichbar, api = API nicht erreichbar, datenbank = API läuft, Datenbank nicht */
export type BackendZustand = "ok" | "api" | "datenbank";

/**
 * Fragt den Healthcheck der API ab, nie gecacht.
 * Die API antwortet mit 503 und datenbank: false, wenn die Datenbank nicht antwortet.
 */
export async function pruefeBackend(): Promise<BackendZustand> {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/health`, {
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
            return "ok";
        }
        if (response.status === 503) {
            const daten = await response.json().catch(() => null);
            if (daten?.datenbank === false) {
                return "datenbank";
            }
        }
        console.error("Healthcheck: API antwortet mit", response.status);
        return "api";
    } catch (error) {
        console.error("Healthcheck: API nicht erreichbar:", error);
        return "api";
    }
}
