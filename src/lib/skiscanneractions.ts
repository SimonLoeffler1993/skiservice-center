"use server";

import { ApiAntwort } from "@/types/actiontypes";
import { ScannerGeraet, ScannerGeraetListeSchema } from "@/types/skiscanner";
import { anfrage } from "./apianfrage";

export async function holeScannerGeraete(): Promise<ApiAntwort<ScannerGeraet[]>> {
    return anfrage("/scanner/skiscanner/geraete", "GET", ScannerGeraetListeSchema, "Scanner-Status konnte nicht geladen werden.");
}
