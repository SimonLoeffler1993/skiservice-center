"use server";

import { ApiAntwort } from "@/types/actiontypes";
import { MailProtokollBezug, MailProtokollEintrag, MailProtokollSchema } from "@/types/mailprotokolltypes";
import { anfrage } from "./apianfrage";

// Versendete Mails eines Kunden, Auftrags oder Verleihs, neueste zuerst
export async function holeMailProtokoll(bezug: MailProtokollBezug, id: number): Promise<ApiAntwort<MailProtokollEintrag[]>> {
    return anfrage(`/mailprotokoll/?${bezug}_id=${id}`, "GET", MailProtokollSchema, "Nachrichten konnten nicht geladen werden.");
}
