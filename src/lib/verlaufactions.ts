"use server";

import { ApiAntwort } from "@/types/actiontypes";
import { Ereignis, EreignisListeSchema, VerlaufBezug } from "@/types/ereignis";
import { anfrage } from "./apianfrage";

/** Wer hat wann was getan: Verlauf eines Auftrags, Verleihs oder einer Quittung, neueste zuerst. */
export async function holeVerlauf(bezug: VerlaufBezug, id: number): Promise<ApiAntwort<Ereignis[]>> {
    return anfrage(`/ereignisse/?${bezug}_id=${id}`, "GET", EreignisListeSchema, "Verlauf konnte nicht geladen werden.");
}
