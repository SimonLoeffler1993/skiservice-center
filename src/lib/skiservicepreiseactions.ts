"use server"

import { skiServicePreiseListeSchema, SkiServicePreiseListe, CreateSkiservicePreis, skiServicePreiseSchema, SkiServicePreise } from "@/types/skiservicepreisetypes";
import { config } from "./config";
import { ApiAntwort } from "@/types/actiontypes";
import { toApiAntwort } from "./helfer";

export async function getSkiservicesPreise(): Promise<ApiAntwort<SkiServicePreiseListe>> {
    const response = await fetch(`${config.backendUrl}/api/v1/skiservice/preise`);
    
   if (!response.ok) {
        console.error("Fehler beim Abrufen der Skiservicepreise:", response.statusText);
        throw new Error("Fehler beim Abrufen der Skiservicepreise");
    }
     
    const data = await response.json();
    
    const parse = skiServicePreiseListeSchema.safeParse(data);

    return toApiAntwort(parse, "Fehler beim abfragen der Preis");
    // if (!parse.success) {
    //     console.error("Fehler beim Parsen der Skiservicepreise:", parse.error);
    //     throw new Error("Ungültige Daten vom Server erhalten");
    // }

    // return parse.data;
}

export async function createSkiservicePreis(previousState: unknown, data: CreateSkiservicePreis): Promise<ApiAntwort<SkiServicePreise>> {
    const response = await fetch(`${config.backendUrl}/api/v1/skiservice/preise`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error("Fehler beim Erstellen des Skiservicepreises:", response.statusText);
        throw new Error("Fehler beim Erstellen des Skiservicepreises");
    }

    const responseData = await response.json();
    const parse = skiServicePreiseSchema.safeParse(responseData);

    return toApiAntwort(parse, "Fehler beim erstellen der Preis");
}

export async function setzeBindungsserviceAction(previousState: unknown, serviceId: number): Promise<ApiAntwort<SkiServicePreise>> {
    const response = await fetch(`${config.backendUrl}/api/v1/skiservice/bindungsservice?bindungsserviceid=${serviceId}`, {
        method: "POST",
        headers: {
            accept: "application/json",
        },
    });

    if (!response.ok) {
        console.error("Fehler beim Setzen des Bindungsservices:", response.statusText);
        throw new Error("Fehler beim Setzen des Bindungsservices");
    }

    const responseData = await response.json();
    const parse = skiServicePreiseSchema.safeParse(responseData);

    return toApiAntwort(parse, "Fehler beim setzen der Preis");
}