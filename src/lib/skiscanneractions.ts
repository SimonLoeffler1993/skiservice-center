"use server";

import { ApiAntwort } from "@/types/actiontypes";
import { FirmwareManifestSchema, ScannerGeraet, ScannerGeraetListeSchema, ScannerGeraetSchema } from "@/types/skiscanner";
import { anfrage } from "./apianfrage";
import { getConfig } from "./config";

export async function holeScannerGeraete(): Promise<ApiAntwort<ScannerGeraet[]>> {
    return anfrage("/scanner/skiscanner/geraete", "GET", ScannerGeraetListeSchema, "Scanner-Status konnte nicht geladen werden.");
}

// Stößt das Firmware-Update nur an: der Scanner prüft und installiert bei seiner nächsten Meldung selbst
export async function starteScannerUpdate(name: string): Promise<ApiAntwort<ScannerGeraet>> {
    return anfrage(
        `/scanner/skiscanner/geraete/${encodeURIComponent(name)}/update`, "POST", ScannerGeraetSchema,
        "Das Firmware-Update konnte nicht angestoßen werden.",
    );
}

// Version der neuesten Firmware aus dem Manifest des Webflashers (dieselbe Quelle, von der die Scanner laden)
export async function holeNeuesteFirmware(): Promise<ApiAntwort<string>> {
    const fehler = "Die neueste Firmware-Version konnte nicht abgerufen werden.";
    try {
        const basis = getConfig().webflasherUrl.replace(/\/+$/, "");
        const antwort = await fetch(`${basis}/firmware/manifest.json`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
        if (!antwort.ok) return { success: false, error: fehler };
        const manifest = FirmwareManifestSchema.safeParse(await antwort.json());
        return manifest.success ? { success: true, data: manifest.data.version } : { success: false, error: fehler };
    } catch {
        return { success: false, error: fehler };
    }
}
