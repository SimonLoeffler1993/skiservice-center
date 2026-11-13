"use server";

import { ApiAntwort } from "@/types/actiontypes";
import { TestErgebnis, TestErgebnisSchema } from "@/types/einstellungentypes";
import {
    MailVorlage, MailVorlageDaten, MailVorlageSchema, MailVorlagenListeSchema, MailVorschau, MailVorschauSchema,
} from "@/types/mailvorlagentypes";
import { anfrage } from "./apianfrage";

export async function holeMailvorlagen(): Promise<ApiAntwort<MailVorlage[]>> {
    return anfrage("/mailvorlagen/", "GET", MailVorlagenListeSchema, "Vorlagen konnten nicht geladen werden.");
}

export async function speichereMailvorlage(schluessel: string, daten: MailVorlageDaten): Promise<ApiAntwort<MailVorlage>> {
    return anfrage(`/mailvorlagen/${encodeURIComponent(schluessel)}`, "PUT", MailVorlageSchema, "Vorlage konnte nicht gespeichert werden.", daten);
}

// Setzt die Vorlage auf den Originaltext zurück
export async function setzeMailvorlageZurueck(schluessel: string): Promise<ApiAntwort<MailVorlage>> {
    return anfrage(`/mailvorlagen/${encodeURIComponent(schluessel)}/zuruecksetzen`, "POST", MailVorlageSchema, "Vorlage konnte nicht zurückgesetzt werden.");
}

// Rendert einen (noch nicht gespeicherten) Stand mit Beispieldaten
export async function vorschauMailvorlage(schluessel: string, daten: MailVorlageDaten): Promise<ApiAntwort<MailVorschau>> {
    return anfrage(`/mailvorlagen/${encodeURIComponent(schluessel)}/vorschau`, "POST", MailVorschauSchema, "Vorschau konnte nicht erstellt werden.", daten);
}

// Sendet die gespeicherte Vorlage mit Beispieldaten
export async function testeMailvorlage(schluessel: string, empfaenger: string): Promise<TestErgebnis> {
    const antwort = await anfrage(`/mailvorlagen/${encodeURIComponent(schluessel)}/test`, "POST", TestErgebnisSchema, "Test-Mail konnte nicht gesendet werden.", { empfaenger });
    return antwort.success ? antwort.data : { success: false, message: antwort.error };
}
