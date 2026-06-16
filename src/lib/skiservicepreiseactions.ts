"use server"

import { skiServicePreiseListeSchema, SkiServicePreiseListe  } from "@/types/skiservicepreisetypes";
import { config } from "./config";

export async function getSkiservicesPreise(): Promise<SkiServicePreiseListe> {
    const response = await fetch(`${config.backendUrl}/api/v1/skiservice/preise`);
    
   if (!response.ok) {
        console.error("Fehler beim Abrufen der Skiservicepreise:", response.statusText);
        throw new Error("Fehler beim Abrufen der Skiservicepreise");
    }
     
    const data = await response.json();
    
    const parse = skiServicePreiseListeSchema.safeParse(data);
    if (!parse.success) {
        console.error("Fehler beim Parsen der Skiservicepreise:", parse.error);
        throw new Error("Ungültige Daten vom Server erhalten");
    }

    return parse.data;
}