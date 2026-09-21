import { config } from "./config";
import { ApiAntwort } from "@/types/actiontypes";
import { toApiAntwort } from "./helfer";

import { CreateSaisonverleihPreis, SaisonverleihPreise, saisonverleihPreiseSchema } from "@/types/saisonverleihpreisetypes";


export async function createSaisonverleihPreis(previousState: unknown, data: CreateSaisonverleihPreis): Promise<ApiAntwort<SaisonverleihPreise>> {
    const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/preise`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error("Fehler beim Erstellen des Saisonverleihpreises:", response.statusText);
        throw new Error("Fehler beim Erstellen des Saisonverleihpreises");
    }

    const responseData = await response.json();
    const parse = saisonverleihPreiseSchema.safeParse(responseData);

    return toApiAntwort(parse, "Fehler beim erstellen der Preis");
}